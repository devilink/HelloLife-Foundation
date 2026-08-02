"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Active Relief Projects</h2>
            <p className="text-muted-foreground text-lg">
              Explore our ongoing operations. Your support directly funds these initiatives, helping communities recover and rebuild.
            </p>
          </div>
          {!hideViewAll && (
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const progress = Math.min((project.raised / project.goal) * 100, 100);
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${project.coverImage})` }}
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20">
                    {project.status}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4" />
                    {project.district}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm font-medium">
                      <span>₹{project.raised.toLocaleString()} raised</span>
                      <span className="text-muted-foreground">of ₹{project.goal.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  
                  <Link 
                    href={`/projects/${project.id}`}
                    className="w-full py-3 rounded-xl border-2 border-primary/20 text-center font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
