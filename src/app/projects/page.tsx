import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectListClient from "@/components/projects/ProjectListClient";

export const metadata: Metadata = {
  title: "Active Relief Projects | Hello Life Foundation",
  description: "Explore our ongoing operations and relief projects. See where your donations are making an impact.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 } }
    });
  } catch (error) {
    console.error("Projects query error:", error);
  }

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
    <main className="min-h-screen bg-muted/20 pb-24">
      <div className="bg-background pt-32 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Our Missions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            These are our current active relief operations on the ground. Use the filters to find specific initiatives.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ProjectListClient initialProjects={formattedProjects} />
      </div>
    </main>
  );
}
