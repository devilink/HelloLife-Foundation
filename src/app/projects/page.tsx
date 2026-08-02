import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ActiveProjects from "@/components/home/ActiveProjects";

export const metadata: Metadata = {
  title: "Active Relief Projects | Hello Life Foundation",
  description: "Explore our ongoing operations and relief projects. See where your donations are making an impact.",
};

export default async function ProjectsPage() {
  // Fetch all active projects from the database
  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { images: { take: 1 } }
  });

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
    <main className="min-h-screen">
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Missions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These are our current active relief operations on the ground.
          </p>
        </div>
      </div>
      
      {formattedProjects.length > 0 ? (
        <ActiveProjects projects={formattedProjects} hideViewAll={true} />
      ) : (
        <div className="py-24 text-center text-muted-foreground">
          <p className="text-xl">No active projects at the moment.</p>
        </div>
      )}
    </main>
  );
}
