import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getHomePageData = unstable_cache(
  async () => {
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
  },
  ["home-page-data"],
  { revalidate: 60, tags: ["home", "projects", "donations", "galleries"] }
);

export const getProjectsData = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: { images: true },
      });
    } catch (error) {
      console.error("Projects query error:", error);
      return [];
    }
  },
  ["projects-data"],
  { revalidate: 60, tags: ["projects"] }
);

export const getTransparencyData = unstable_cache(
  async () => {
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
  },
  ["transparency-data"],
  { revalidate: 60, tags: ["expenses", "settings"] }
);

export const getGalleryData = unstable_cache(
  async () => {
    try {
      return await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Gallery query error:", error);
      return [];
    }
  },
  ["gallery-data"],
  { revalidate: 60, tags: ["galleries"] }
);

export const getProjectById = unstable_cache(
  async (id: string) => {
    try {
      return await (prisma.project as any).findUnique({
        where: { id },
        include: { images: true, expenses: { orderBy: { date: 'desc' } } }
      });
    } catch (error) {
      console.error("Project fetch error:", error);
      return null;
    }
  },
  ["project-details"],
  { revalidate: 60, tags: ["projects", "expenses"] }
);

export const getAllProjectIds = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        select: { id: true }
      });
    } catch (error) {
      console.error("Project IDs fetch error:", error);
      return [];
    }
  },
  ["all-project-ids"],
  { revalidate: 3600, tags: ["projects"] }
);
