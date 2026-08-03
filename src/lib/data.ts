import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export async function getHomePageData() {
  try {
    const res = await Promise.all([
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.helpRequest.count({ where: { status: "PENDING" } }),
      prisma.project.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { images: true },
      }),
      (prisma as any).gallery.findMany({
        where: { projectId: null },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.donation.findMany({
        orderBy: { amount: "desc" },
        take: 5,
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      activeProjectsCount: res[0],
      completedProjectsCount: res[1],
      pendingRequestsCount: res[2],
      projects: res[3],
      galleries: res[4],
      topDonations: res[5],
      recentDonations: res[6],
    };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return {
      activeProjectsCount: 0,
      completedProjectsCount: 0,
      pendingRequestsCount: 0,
      projects: [],
      galleries: [],
      topDonations: [],
      recentDonations: [],
    };
  }
}

export async function getProjectsData() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
  } catch (error) {
    console.error("Projects query error:", error);
    return [];
  }
}

export async function getTransparencyData() {
  try {
    const res = await Promise.all([
      prisma.expense.findMany({
        orderBy: { date: "desc" },
      }),
      prisma.setting.findMany(),
    ]);
    return {
      expenses: res[0],
      dbSettings: res[1],
    };
  } catch (error) {
    console.error("Transparency query error:", error);
    return { expenses: [], dbSettings: [] };
  }
}

export async function getGalleryData() {
  try {
    return await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gallery query error:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    return await (prisma.project as any).findUnique({
      where: { id },
      include: { images: true, expenses: { orderBy: { date: 'desc' } } }
    });
  } catch (error) {
    console.error("Project fetch error:", error);
    return null;
  }
}

export async function getAllProjectIds() {
  try {
    return await prisma.project.findMany({
      select: { id: true }
    });
  } catch (error) {
    console.error("Project IDs fetch error:", error);
    return [];
  }
}
