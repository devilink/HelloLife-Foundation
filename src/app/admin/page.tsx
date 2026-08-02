import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const [
    dbSettings,
    pendingRequestsCount,
    completedRequestsCount,
    activeProjectsCount,
  ] = await Promise.all([
    prisma.setting.findMany(),
    prisma.helpRequest.count({ where: { status: "PENDING" } }),
    prisma.helpRequest.count({ where: { status: "COMPLETED" } }),
    prisma.project.count({ where: { status: "ACTIVE" } }),
  ]);

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

