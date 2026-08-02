"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

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
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">Active Relief Projects</h3>
            <p className="text-slate-500 text-sm md:text-base mt-1">Direct ground initiatives powered by your donations</p>
          </div>
          {!hideViewAll && (
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-sm text-emerald-600 font-bold hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-xl"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const progress = Math.min((project.raised / project.goal) * 100, 100);
            
            return (
              <div key={project.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div className="relative h-64 md:h-72 overflow-hidden bg-slate-100 p-2 flex items-center justify-center">
                  <img 
                    src={project.coverImage || "/placeholder.jpg"} 
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" 
                    alt={project.name} 
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                    {project.status || "ACTIVE"}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {project.district}
                    </div>
                    <h4 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 leading-snug">{project.name}</h4>
                    {project.description && (
                      <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm font-semibold text-slate-600 mb-5">
                      <span>₹ {project.raised.toLocaleString()} raised</span>
                      <span className="text-slate-400">Goal: ₹ {project.goal.toLocaleString()}</span>
                    </div>

                    <Link 
                      href={`/projects/${project.id}`}
                      className="block w-full py-3 text-center bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      View Details & Expenses
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

