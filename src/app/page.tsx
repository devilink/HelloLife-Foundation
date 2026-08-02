import HeroSection from "@/components/home/HeroSection";
import TransparencyStats from "@/components/home/TransparencyStats";
import ActiveProjects from "@/components/home/ActiveProjects";
import SupportSection from "@/components/home/SupportSection";
import ImpactGallery from "@/components/home/ImpactGallery";
import TopDonors from "@/components/home/TopDonors";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function Home() {
  let dbSettings: any[] = [];
  let activeProjectsCount = 0;
  let completedProjectsCount = 0;
  let pendingRequestsCount = 0;
  let projects: any[] = [];
  let galleries: any[] = [];
  let topDonations: any[] = [];
  let recentDonations: any[] = [];

  try {
    const res = await Promise.all([
      prisma.setting.findMany(),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.helpRequest.count({ where: { status: "PENDING" } }),
      prisma.project.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { images: true }
      }),
      (prisma.gallery as any).findMany({ where: { projectId: null }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.donation.findMany({
        orderBy: { amount: "desc" },
        take: 5
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);
    dbSettings = res[0];
    activeProjectsCount = res[1];
    completedProjectsCount = res[2];
    pendingRequestsCount = res[3];
    projects = res[4];
    galleries = res[5];
    topDonations = res[6];
    recentDonations = res[7];
  } catch (error) {
    console.error("Home page DB query error:", error);
  }

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
    peopleHelped: settingsMap.peopleHelped || "0",
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
    raised: (p as any).raised || 0,
    images: p.images?.map((img: any) => img.url) || [],
    coverImage: p.images[0]?.url || "/hero-bg.jpg",
    status: p.status,
  }));

  return (
    <>
      <HeroSection />
      <TransparencyStats stats={stats} />
      <ActiveProjects projects={formattedProjects} />
      {settingsMap.showTopDonors !== "false" && (
        <TopDonors topDonors={topDonations} recentDonors={recentDonations} />
      )}
      <SupportSection />

      {/* Impact in Action (Conditional) */}
      {settingsMap.showImpactInAction !== "false" && (
        <ImpactGallery galleryImages={galleries} />
      )}
    </>
  );
}
