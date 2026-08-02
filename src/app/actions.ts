"use server";

import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/email";
import { Urgency } from "@prisma/client";

export async function trackHelpRequest(id: string) {
  if (!id) return null;

  try {
    const request = await prisma.helpRequest.findUnique({
      where: { id: id.trim() }
    });

    if (!request) return null;

    // For demonstration, if volunteer is assigned, we could fetch them here 
    // but the schema doesn't have a direct relation, only `assignedTo` (String).
    // Let's assume assignedTo is the Volunteer's ID if present.
    let volunteerData = null;
    if (request.assignedTo) {
      const vol = await prisma.volunteer.findUnique({ where: { id: request.assignedTo } });
      if (vol) {
        volunteerData = {
          name: vol.fullName,
          phone: vol.phoneNumber,
        };
      }
    }

    return {
      id: request.id,
      status: request.status,
      category: request.emergencyType,
      date: request.createdAt.toISOString().split("T")[0],
      location: `${request.village}, ${request.district}`,
      name: request.fullName,
      adminRemarks: request.adminRemarks,
      volunteer: volunteerData,
    };
  } catch (error) {
    console.error("Error tracking request:", error);
    return null;
  }
}

export async function submitHelpRequest(data: any, attachments?: any[]) {
  try {
    const request = await prisma.helpRequest.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        alternateContact: data.alternateContact || null,
        district: data.district,
        village: data.village,
        address: data.address,
        pinCode: data.pinCode,
        emergencyType: data.emergencyType,
        description: data.description,
        familyMembers: Number(data.familyMembers),
        children: Number(data.children),
        seniorCitizens: Number(data.seniorCitizens),
        urgency: data.urgency as Urgency,
      }
    });

    // Send email notification
    await sendAdminNotification(
      `New Help Request: ${request.id}`,
      `
      <h2>New Help Request</h2>
      <p><strong>ID:</strong> ${request.id}</p>
      <p><strong>Name:</strong> ${request.fullName}</p>
      <p><strong>Phone:</strong> ${request.phoneNumber}</p>
      <p><strong>Emergency:</strong> ${request.emergencyType} (${request.urgency})</p>
      <p><strong>Location:</strong> ${request.village}, ${request.district}</p>
      <p><strong>Description:</strong> ${request.description}</p>
      <br/>
      <a href="http://localhost:3000/admin/requests">View in Admin Portal</a>
      `,
      attachments
    );

    return { success: true, id: request.id };
  } catch (error) {
    console.error("Failed to submit help request:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

export async function submitDonationConfirmation(data: any) {
  try {
    const confirmation = await prisma.donationConfirmation.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        amount: Number(data.amount),
        paymentDate: new Date(data.paymentDate),
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        message: data.message || null,
        screenshotUrl: "pending", // Handle file upload in a real app
        anonymous: data.isAnonymous === "true",
      }
    });

    // Send email notification
    await sendAdminNotification(
      `New Donation to Verify: ₹${confirmation.amount}`,
      `
      <h2>New Donation Needs Verification</h2>
      <p><strong>Name:</strong> ${confirmation.fullName}</p>
      <p><strong>Amount:</strong> ₹${confirmation.amount}</p>
      <p><strong>Method:</strong> ${confirmation.paymentMethod}</p>
      <p><strong>Transaction ID:</strong> ${confirmation.transactionId}</p>
      <p><strong>Date:</strong> ${confirmation.paymentDate.toISOString().split("T")[0]}</p>
      <br/>
      <a href="http://localhost:3000/admin/donations">Verify in Admin Portal</a>
      `
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to submit donation confirmation:", error);
    return { success: false, error: "Failed to submit donation" };
  }
}

export async function submitVolunteerApplication(data: any) {
  try {
    const volunteer = await prisma.volunteer.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        district: data.district,
        vehicleType: data.vehicleType || null,
        availability: data.availability || null,
        isActive: true,
      }
    });

    // Send email notification
    await sendAdminNotification(
      `New Volunteer Registration: ${volunteer.fullName}`,
      `
      <h2>New Volunteer Registration</h2>
      <p><strong>Name:</strong> ${volunteer.fullName}</p>
      <p><strong>Phone:</strong> ${volunteer.phoneNumber}</p>
      <p><strong>Email:</strong> ${volunteer.email}</p>
      <p><strong>District:</strong> ${volunteer.district}</p>
      <p><strong>Vehicle:</strong> ${volunteer.vehicleType || 'None specified'}</p>
      <p><strong>Availability:</strong> ${volunteer.availability || 'None specified'}</p>
      <br/>
      <a href="http://localhost:3000/admin/volunteers">View in Admin Portal</a>
      `
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to submit volunteer application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}
