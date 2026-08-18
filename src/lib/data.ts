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
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
            goal: true,
            raised: true,
            status: true,
            images: { take: 1, select: { url: true } },
          },
        }),
        (prisma as any).gallery.findMany({
          where: { projectId: null },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            url: true,
            title: true,
            category: true,
          }
        }),
        prisma.donation.findMany({
          orderBy: { amount: "desc" },
          take: 5,
          select: {
            id: true,
            donorName: true,
            amount: true,
            paymentDate: true,
            anonymous: true,
          }
        }),
        prisma.donation.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            donorName: true,
            amount: true,
            paymentDate: true,
            anonymous: true,
          }
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
  ['home-data'],
  { revalidate: 3600, tags: ['home-data'] }
);

export const getProjectsData = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          goal: true,
          raised: true,
          status: true,
          images: { take: 1, select: { url: true } },
        },
      });
    } catch (error) {
      console.error("Projects query error:", error);
      return [];
    }
  },
  ['projects-data'],
  { revalidate: 3600, tags: ['projects-data'] }
);

export const getTransparencyData = unstable_cache(
  async () => {
    try {
      const res = await Promise.all([
        prisma.expense.findMany({
          orderBy: { date: "desc" },
          select: {
            id: true,
            title: true,
            category: true,
            amount: true,
            date: true,
            location: true,
            description: true,
            receiptUrl: true,
            projectId: true,
            approvedBy: true,
          }
        }),
        prisma.setting.findMany({
          select: {
            key: true,
            value: true,
          }
        }),
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
  ['transparency-data'],
  { revalidate: 3600, tags: ['transparency-data'] }
);

export const getGalleryData = unstable_cache(
  async () => {
    try {
      return await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          url: true,
          title: true,
          category: true,
          type: true,
          projectId: true,
        }
      });
    } catch (error) {
      console.error("Gallery query error:", error);
      return [];
    }
  },
  ['gallery-data'],
  { revalidate: 3600, tags: ['gallery-data'] }
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
  ['project-by-id'],
  { revalidate: 3600, tags: ['project-by-id'] }
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
  ['all-project-ids'],
  { revalidate: 3600, tags: ['all-project-ids'] }
);
