"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Filter } from "lucide-react";
import { useState } from "react";
import ImageCarousel from "@/components/ui/ImageCarousel";

interface Project {
  id: string;
  name: string;
  description: string;
  district: string;
  goal: number;
  raised: number;
  images?: string[];
  coverImage: string;
  status: string;
}

export default function ProjectListClient({ initialProjects }: { initialProjects: Project[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const uniqueDistricts = Array.from(new Set(initialProjects.map((p) => p.district).filter(Boolean)));

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDEBAR: Filters */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm sticky top-32">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Filters</h2>
          </div>

          <div className="space-y-8">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">District</label>
              <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm">
                <option value="all">All Locations</option>
                {uniqueDistricts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Category</label>
              <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm">
                <option value="all">All Categories</option>
                <option value="medical">Medical</option>
                <option value="shelter">Shelter</option>
                <option value="food">Food & Water</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Status</label>
              <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Grid */}
      <div className="flex-1">
        {initialProjects.length === 0 ? (
          <div className="bg-card rounded-[2rem] p-16 text-center border border-border shadow-sm">
            <p className="text-xl text-muted-foreground">No projects at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {initialProjects.map((project, idx) => {
              const progress = Math.min((project.raised / project.goal) * 100, 100);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex flex-col bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden bg-muted/30 p-2 flex items-center justify-center">
                    <ImageCarousel
                      images={project.images && project.images.length > 0 ? project.images : [project.coverImage]}
                      alt={project.name}
                      className="rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-primary shadow-sm border border-border">
                      {project.status}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-4">
                      <MapPin className="h-4 w-4" />
                      {project.district}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 line-clamp-2 leading-snug text-foreground">{project.name}</h3>
                    <p className="text-muted-foreground text-base line-clamp-2 mb-8 flex-1 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-foreground">₹{project.raised.toLocaleString()} raised</span>
                        <span className="text-muted-foreground">Goal: ₹{project.goal.toLocaleString()}</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-secondary rounded-full"
                        />
                      </div>
                    </div>
                    
                    <Link 
                      href={`/projects/${project.id}`}
                      className="w-full py-4 rounded-2xl bg-primary/5 border border-primary/20 text-center font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
}
