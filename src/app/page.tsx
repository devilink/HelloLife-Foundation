import HeroSection from "@/components/home/HeroSection";
import TransparencyStats from "@/components/home/TransparencyStats";
import ActiveProjects from "@/components/home/ActiveProjects";
import SupportSection from "@/components/home/SupportSection";
import ImpactGallery from "@/components/home/ImpactGallery";
import TopDonors from "@/components/home/TopDonors";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getHomePageData } from "@/lib/data";
export const dynamic = 'force-dynamic';
export default async function Home() {
  let settingsMap: Record<string, string> = {};
  
  const [settings, homeData] = await Promise.all([
    getSettings(),
    getHomePageData(),
  ]);

  settingsMap = settings as Record<string, string>;
  const {
    activeProjectsCount,
    completedProjectsCount,
    pendingRequestsCount,
    projects,
    galleries,
    topDonations,
    recentDonations,
  } = homeData;

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
