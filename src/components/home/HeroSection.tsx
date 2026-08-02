"use client";

import Link from "next/link";
import { Heart, ShieldCheck, HeartHandshake, FolderOpen } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative bg-slate-900 text-white py-36 px-4 sm:px-6 lg:px-8 text-center md:text-left min-h-[85vh] flex flex-col justify-center overflow-hidden">
      {/* Background Image with responsive positioning */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-[15%_center] md:bg-[60%_center]"
        style={{ backgroundImage: "url('/herp.png')" }}
        aria-hidden="true"
      />
      {/* Extremely Light Gradient Overlay for subtle contrast */}
      <div className="absolute inset-0 bg-slate-900/20 md:bg-transparent md:bg-gradient-to-r md:from-slate-900/50 md:via-slate-900/10 md:to-transparent" />
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center md:items-start justify-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight max-w-3xl">
          Together We Can <br className="hidden md:block" />
          <span className="text-emerald-400">Change Lives</span>
        </h2>
        <p className="text-slate-200 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed font-medium">
          Your support today can create a better tomorrow for those who need it most.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 max-w-3xl">
          <Link 
            href="/donate" 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-base md:text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
          >
            <Heart className="w-5 h-5" /> Donate Now
          </Link>
          <Link 
            href="/projects" 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-base md:text-lg px-8 py-4 rounded-xl font-bold border border-slate-600 transition-all shadow-lg hover:-translate-y-1"
          >
            <FolderOpen className="w-5 h-5" /> Running Projects
          </Link>
          <Link 
            href="/request-help" 
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-base md:text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
          >
            <ShieldCheck className="w-5 h-5" /> Request Help
          </Link>
          <Link 
            href="/volunteer" 
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-base md:text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
          >
            <HeartHandshake className="w-5 h-5" /> Be a Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
}
