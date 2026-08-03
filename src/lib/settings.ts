import { prisma } from "@/lib/prisma";

import { unstable_cache } from "next/cache";

export const getSettings = unstable_cache(
  async () => {
    try {
      const dbSettings = await prisma.setting.findMany();
      return dbSettings.reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      return {};
    }
  },
  ['site-settings'],
  { tags: ['settings'] }
);
