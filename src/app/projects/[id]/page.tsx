import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Share2, Heart, Clock } from "lucide-react";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectDetailCarousel from "@/components/projects/ProjectDetailCarousel";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const project = await (prisma.project as any).findUnique({
    where: { id: resolvedParams.id },
    include: { images: true, expenses: { orderBy: { date: 'desc' } } }
  });

  if (!project) {
    // notFound();
  }

  const p = project || {
    name: "Emergency Flood Relief in Kerala",
    description: "Providing immediate assistance including food, clean water, and medical supplies to the affected regions.",
    location: "Kerala, India",
    goal: 5000000,
    raised: 1500000,
    expensesTotal: 500000,
    supportersCount: 345,
    status: "ACTIVE",
    images: [{ url: "/hero-bg.jpg" }],
    expenses: []
  };

  const allImages = (p as any).images?.map((img: any) => img.url) || ["/hero-bg.jpg"];
  const raisedAmount = Number((p as any).raised) || 0;
  const goalAmount = Number(p.goal) > 0 ? Number(p.goal) : 1;
  const progress = Math.min((raisedAmount / goalAmount) * 100, 100);

  return (
    <main className="min-h-screen bg-muted/20 pb-24">
      {/* Cover Image Carousel */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        <ProjectDetailCarousel images={allImages} alt={p.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex items-center gap-3 text-white/80 text-sm font-medium mb-4">
              <span className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full text-white">
                {p.status}
              </span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {p.location || "Various Locations"}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
              {p.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Tabbed Content */}
          <div className="flex-1">
            <ProjectTabs project={p} />
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-32 bg-card rounded-[2.5rem] p-8 border border-border shadow-xl shadow-black/5">
              <div className="space-y-6">
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-extrabold text-foreground">₹{raisedAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground font-medium mb-1">raised</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(progress, 1)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-muted-foreground">
                    <span>{progress.toFixed(1)}% of Goal</span>
                    <span>Goal: ₹{p.goal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="py-6 border-y border-border">
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-3xl font-bold text-foreground">{(p as any).supportersCount || 0}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Supporters</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Link href="/donate">
                    <button className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" /> Back this Project
                    </button>
                  </Link>
                  <button className="w-full py-4 rounded-2xl border-2 border-border text-foreground font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
