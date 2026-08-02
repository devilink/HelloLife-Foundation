"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  const isAllowed = primaryEmail && allowedEmails.includes(primaryEmail.toLowerCase());
  
  if (!isAllowed) {
    throw new Error("Unauthorized: Admin access required");
  }

  return primaryEmail;
}

// ----------------- SETTINGS -----------------

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  revalidatePath("/", "layout");
}

export async function updateSettingsBulk(settings: Record<string, string>) {
  await requireAdmin();
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
  revalidatePath("/", "layout");
  return { success: true };
}

// ----------------- HELP REQUESTS -----------------

export async function updateRequestStatus(id: string, status: any) {
  await requireAdmin();
  await prisma.helpRequest.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteHelpRequest(id: string) {
  await requireAdmin();
  await prisma.helpRequest.delete({
    where: { id }
  });
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { success: true };
}

// ----------------- PROJECTS -----------------

export async function createProject(data: { name: string, description: string, goal: number, location: string, coverImage: string }) {
  await requireAdmin();
  
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      goal: data.goal,
      location: data.location,
      status: "ACTIVE",
    }
  });

  if (data.coverImage) {
    await prisma.projectImage.create({
      data: {
        url: data.coverImage,
        projectId: project.id
      }
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function updateProject(id: string, data: { name: string, description: string, goal: number, raised: number, expensesTotal: number, supportersCount: number, location: string, coverImage?: string }) {
  await requireAdmin();
  
  await prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      goal: data.goal,
      raised: data.raised,
      expensesTotal: data.expensesTotal,
      supportersCount: data.supportersCount,
      location: data.location,
    }
  });

  if (data.coverImage) {
    // Optionally remove old ones or just add new. We'll just add new for now as this is a simple schema.
    await prisma.projectImage.create({
      data: {
        url: data.coverImage,
        projectId: id
      }
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

export async function updateProjectStatus(id: string, status: any) {
  await requireAdmin();
  await prisma.project.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({
    where: { id }
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

// ----------------- DONATIONS -----------------

export async function verifyDonation(confirmationId: string) {
  const adminEmail = await requireAdmin();
  
  const confirmation = await prisma.donationConfirmation.findUnique({
    where: { id: confirmationId }
  });

  if (!confirmation || confirmation.status === "VERIFIED") {
    throw new Error("Invalid or already verified donation");
  }

  // Update status
  await prisma.donationConfirmation.update({
    where: { id: confirmationId },
    data: { status: "VERIFIED" }
  });

  // Create actual donation ledger entry
  await prisma.donation.create({
    data: {
      donorName: confirmation.fullName,
      anonymous: confirmation.anonymous,
      amount: confirmation.amount,
      paymentDate: confirmation.paymentDate,
      paymentMethod: confirmation.paymentMethod,
      transactionId: confirmation.transactionId,
      receiptUrl: confirmation.screenshotUrl,
      notes: confirmation.message,
      createdBy: adminEmail
    }
  });

  revalidatePath("/admin/donations");
  revalidatePath("/transparency");
  return { success: true };
}

export async function rejectDonationConfirmation(confirmationId: string) {
  await requireAdmin();
  await prisma.donationConfirmation.update({
    where: { id: confirmationId },
    data: { status: "REJECTED" }
  });
  revalidatePath("/admin/donations");
  return { success: true };
}

export async function addOfflineDonation(data: { donorName: string, amount: number, paymentDate: string, paymentMethod: string, notes?: string }) {
  const adminEmail = await requireAdmin();
  
  await prisma.donation.create({
    data: {
      donorName: data.donorName,
      anonymous: false,
      amount: data.amount,
      paymentDate: new Date(data.paymentDate),
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      createdBy: adminEmail
    }
  });

  revalidatePath("/admin/donations");
  revalidatePath("/transparency");
  return { success: true };
}

// ----------------- EXPENSES -----------------

export async function addExpense(data: { title: string, category: string, amount: number, date: string, location: string, description: string, receiptUrl?: string, projectId?: string }) {
  const adminEmail = await requireAdmin();
  
  await prisma.expense.create({
    data: {
      title: data.title,
      category: data.category,
      amount: data.amount,
      date: new Date(data.date),
      location: data.location,
      description: data.description,
      receiptUrl: data.receiptUrl,
      approvedBy: adminEmail,
      projectId: data.projectId || null
    }
  });

  // If tied to a project, update the project's total expenses? The user wants admin to manage it manually, but we can do it auto here or let them update it via updateProject. We'll leave it to manual updateProject as per user request to "admin can operate crud operation".


  revalidatePath("/admin/expenses");
  revalidatePath("/transparency");
  return { success: true };
}

export async function deleteExpense(id: string) {
  await requireAdmin();
  await prisma.expense.delete({
    where: { id }
  });
  revalidatePath("/admin/expenses");
  revalidatePath("/transparency");
  return { success: true };
}

// ----------------- GALLERY -----------------

export async function addGalleryImage(data: { title: string, category: string, url: string, type: string, projectId?: string }) {
  await requireAdmin();
  await prisma.gallery.create({
    data: {
      title: data.title,
      category: data.category,
      url: data.url,
      type: data.type || "IMAGE",
      projectId: data.projectId || null
    }
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.gallery.delete({
    where: { id }
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

// ----------------- VOLUNTEERS -----------------

export async function addVolunteer(data: { fullName: string, phoneNumber: string, email: string, district: string, vehicleType?: string, availability?: string }) {
  await requireAdmin();
  await prisma.volunteer.create({
    data: {
      ...data,
      isActive: true,
      completedTasks: 0
    }
  });
  revalidatePath("/admin/volunteers");
  return { success: true };
}

export async function updateVolunteer(id: string, data: { fullName: string, phoneNumber: string, email: string, district: string, vehicleType?: string, availability?: string, isActive: boolean, completedTasks: number }) {
  await requireAdmin();
  await prisma.volunteer.update({
    where: { id },
    data
  });
  revalidatePath("/admin/volunteers");
  return { success: true };
}

export async function deleteVolunteer(id: string) {
  await requireAdmin();
  await prisma.volunteer.delete({
    where: { id }
  });
  revalidatePath("/admin/volunteers");
  return { success: true };
}

// ----------------- DONATIONS LEDGER -----------------

export async function updateDonation(id: string, data: { donorName: string, anonymous: boolean, amount: number, paymentDate: string, paymentMethod: string, transactionId?: string }) {
  await requireAdmin();
  await prisma.donation.update({
    where: { id },
    data: {
      donorName: data.donorName,
      anonymous: data.anonymous,
      amount: data.amount,
      paymentDate: new Date(data.paymentDate),
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId
    }
  });
  revalidatePath("/admin/donations");
  revalidatePath("/transparency");
  return { success: true };
}

export async function deleteDonationLedgerEntry(id: string) {
  await requireAdmin();
  await prisma.donation.delete({
    where: { id }
  });
  revalidatePath("/admin/donations");
  revalidatePath("/transparency");
  return { success: true };
}
