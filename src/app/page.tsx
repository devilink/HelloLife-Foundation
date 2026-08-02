import HeroSection from "@/components/home/HeroSection";
import TransparencyStats from "@/components/home/TransparencyStats";
import ActiveProjects from "@/components/home/ActiveProjects";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch real data from Prisma
  const [
    dbSettings,
    activeProjectsCount,
    completedProjectsCount,
    pendingRequestsCount,
    projects
  ] = await Promise.all([
    prisma.setting.findMany(),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.helpRequest.count({ where: { status: "PENDING" } }),
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 } }
    })
  ]);

  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const stats = {
    totalRaised: settingsMap.totalRaised || "0",
    totalExpenses: settingsMap.totalExpenses || "0",
    remainingBalance: settingsMap.remainingBalance || "0",
    activeProjects: activeProjectsCount,
    completedProjects: completedProjectsCount,
    familiesHelped: settingsMap.familiesHelped || "0",
    volunteers: settingsMap.totalVolunteers || "0",
    pendingRequests: pendingRequestsCount,
  };

  // Format projects for the component
  const formattedProjects = projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    district: p.location || "Various",
    goal: p.goal,
    raised: 0, // In a full app, this would aggregate donations per project
    coverImage: p.images[0]?.url || "/hero-bg.jpg",
    status: p.status,
  }));

  return (
    <>
      <HeroSection />
      <TransparencyStats stats={stats} />
      <ActiveProjects projects={formattedProjects} />
    </>
  );
}
