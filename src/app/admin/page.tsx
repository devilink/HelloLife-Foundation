import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let dbSettings: any[] = [];
  let pendingRequestsCount = 0;
  let completedRequestsCount = 0;
  let activeProjectsCount = 0;

  try {
    const res = await Promise.all([
      prisma.setting.findMany(),
      prisma.helpRequest.count({ where: { status: "PENDING" } }),
      prisma.helpRequest.count({ where: { status: "COMPLETED" } }),
      prisma.project.count({ where: { status: "ACTIVE" } }),
    ]);
    dbSettings = res[0];
    pendingRequestsCount = res[1];
    completedRequestsCount = res[2];
    activeProjectsCount = res[3];
  } catch (error) {
    console.error("Admin dashboard DB error:", error);
  }

  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const stats = {
    totalRaised: settingsMap.totalRaised || "0",
    totalExpenses: settingsMap.totalExpenses || "0",
    totalVolunteers: settingsMap.totalVolunteers || "0",
    familiesHelped: settingsMap.familiesHelped || "0",
    pendingRequests: pendingRequestsCount.toString(),
    completedRequests: completedRequestsCount.toString(),
    activeProjects: activeProjectsCount.toString(),
  };

  return <AdminDashboardClient stats={stats} />;
}

