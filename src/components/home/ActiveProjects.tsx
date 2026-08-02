"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  district: string;
  goal: number;
  raised: number;
  coverImage: string;
  status: string;
}

export default function ActiveProjects({ projects, hideViewAll = false }: { projects: Project[], hideViewAll?: boolean }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">FEATURED RUNNING PROJECTS</h3>
          {!hideViewAll && (
            <Link 
              href="/projects" 
              className="text-xs text-sky-600 font-medium hover:underline"
            >
              View All Projects &rarr;
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => {
            const progress = Math.min((project.raised / project.goal) * 100, 100);
            
            return (
              <div key={project.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between">
                <img src={project.coverImage || "/placeholder.jpg"} className="h-28 w-full object-cover" alt={project.name} />
                <div className="p-3">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{project.name}</h4>
                  <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {project.district}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-3">
                    <span>₹ {project.raised.toLocaleString()} raised</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="block w-full py-1.5 text-center bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
