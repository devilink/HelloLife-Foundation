import { prisma } from "@/lib/prisma";

export async function getSettings() {
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
}
