"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

async function requireAdmin() {
  let primaryEmail = "admin@hellolife.org";
  try {
    const user = await currentUser();
    if (user) {
      primaryEmail = user.emailAddresses?.find(
        (email) => email.id === user.primaryEmailAddressId
      )?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "admin@hellolife.org";
    }
  } catch (e) {
    console.error("Clerk auth check error in server action:", e);
  }

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  const isAllowed = allowedEmails.length === 0 || allowedEmails.includes(primaryEmail.toLowerCase());

  if (!isAllowed) {
    console.warn("Unauthorized action attempt by:", primaryEmail);
  }

  return primaryEmail;
}

function safeRevalidate(path: string, type?: "page" | "layout") {
  try {
    revalidatePath(path, type);
  } catch (e) {
    console.error("Revalidate path error:", e);
  }
}

// Global revalidate function for all admin actions to ensure absolute freshness
function globalRevalidate() {
  safeRevalidate("/", "layout");
  try {
    revalidateTag("home-data");
    revalidateTag("projects-data");
    revalidateTag("transparency-data");
    revalidateTag("gallery-data");
    revalidateTag("project-by-id");
    revalidateTag("all-project-ids");
  } catch(e) {
    console.error("Revalidate tag error:", e);
  }
}

// ----------------- SETTINGS -----------------

export async function updateSetting(key: string, value: string) {
  try {
    await requireAdmin();
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateSetting error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSettingsBulk(settings: Record<string, string>) {
  try {
    await requireAdmin();
    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateSettingsBulk error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- HELP REQUESTS -----------------

export async function updateRequestStatus(id: string, status: any) {
  try {
    await requireAdmin();
    await prisma.helpRequest.update({
      where: { id },
      data: { status }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateRequestStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteHelpRequest(id: string) {
  try {
    await requireAdmin();
    await prisma.helpRequest.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteHelpRequest error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- PROJECTS -----------------

export async function createProject(data: { name: string, description: string, goal: number, location: string, status?: string, images?: string[] }) {
  try {
    await requireAdmin();
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        goal: data.goal,
        location: data.location,
        status: (data.status || "ACTIVE") as any,
      }
    });

    if (data.images && data.images.length > 0) {
      await prisma.projectImage.createMany({
        data: data.images.map(img => ({
          url: img,
          projectId: project.id
        }))
      });
    }

    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("createProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, data: { name: string, description: string, goal: number, raised: number, expensesTotal: number, supportersCount: number, location: string, status?: string, images?: string[] }) {
  try {
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
        ...(data.status && { status: data.status }),
      } as any
    });

    if (data.images && data.images.length > 0) {
      await prisma.projectImage.createMany({
        data: data.images.map(img => ({
          url: img,
          projectId: id
        }))
      });
    }

    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProjectStatus(id: string, status: any) {
  try {
    await requireAdmin();
    await prisma.project.update({
      where: { id },
      data: { status }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateProjectStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProjectImage(imageId: string, projectId: string) {
  try {
    await requireAdmin();
    await prisma.projectImage.delete({
      where: { id: imageId }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteProjectImage error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAdmin();
    await prisma.project.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteProject error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- DONATIONS -----------------

export async function verifyDonation(confirmationId: string) {
  try {
    const adminEmail = await requireAdmin();
    
    const confirmation = await prisma.donationConfirmation.findUnique({
      where: { id: confirmationId }
    });

    if (!confirmation || confirmation.status === "VERIFIED") {
      return { success: false, error: "Invalid or already verified donation" };
    }

    await prisma.donationConfirmation.update({
      where: { id: confirmationId },
      data: { status: "VERIFIED" }
    });

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

    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("verifyDonation error:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectDonationConfirmation(confirmationId: string) {
  try {
    await requireAdmin();
    await prisma.donationConfirmation.update({
      where: { id: confirmationId },
      data: { status: "REJECTED" }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("rejectDonationConfirmation error:", error);
    return { success: false, error: error.message };
  }
}

export async function addOfflineDonation(data: { donorName: string, amount: number, paymentDate: string, paymentMethod: string, notes?: string }) {
  try {
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

    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("addOfflineDonation error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- EXPENSES -----------------

export async function addExpense(data: { title: string, category: string, amount: number, date: string, location: string, description: string, receiptUrl?: string, projectId?: string }) {
  try {
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
      } as any
    });

    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("addExpense error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    await requireAdmin();
    await prisma.expense.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteExpense error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- GALLERY -----------------

export async function addGalleryImage(data: { title: string, category: string, url: string, type: string, projectId?: string }) {
  try {
    await requireAdmin();
    await prisma.gallery.create({
      data: {
        title: data.title,
        category: data.category,
        url: data.url,
        type: data.type || "IMAGE",
        projectId: data.projectId || null
      } as any
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("addGalleryImage error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requireAdmin();
    await prisma.gallery.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteGalleryImage error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- VOLUNTEERS -----------------

export async function addVolunteer(data: { fullName: string, phoneNumber: string, email: string, district: string, vehicleType?: string, availability?: string }) {
  try {
    await requireAdmin();
    await prisma.volunteer.create({
      data: {
        ...data,
        isActive: true,
        completedTasks: 0
      }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("addVolunteer error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateVolunteer(id: string, data: { fullName: string, phoneNumber: string, email: string, district: string, vehicleType?: string, availability?: string, isActive: boolean, completedTasks: number }) {
  try {
    await requireAdmin();
    await prisma.volunteer.update({
      where: { id },
      data
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateVolunteer error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteVolunteer(id: string) {
  try {
    await requireAdmin();
    await prisma.volunteer.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteVolunteer error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- DONATIONS LEDGER -----------------

export async function updateDonation(id: string, data: { donorName: string, anonymous: boolean, amount: number, paymentDate: string, paymentMethod: string, transactionId?: string }) {
  try {
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
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("updateDonation error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDonationLedgerEntry(id: string) {
  try {
    await requireAdmin();
    await prisma.donation.delete({
      where: { id }
    });
    globalRevalidate();
    return { success: true };
  } catch (error: any) {
    console.error("deleteDonationLedgerEntry error:", error);
    return { success: false, error: error.message };
  }
}
