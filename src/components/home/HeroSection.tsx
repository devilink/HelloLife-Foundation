"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, LifeBuoy, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-muted/30">
      {/* Background Image / Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/herp.png')",
          filter: "brightness(0.4)"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground backdrop-blur-md border border-primary/30">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium">Emergency Relief Active</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rebuilding Lives, <br className="hidden md:block" />
            <span className="text-primary-foreground/90">Restoring Hope.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Our mission is to provide immediate flood relief, humanitarian support, and absolute transparency in every contribution you make.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              href="/donate" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(var(--primary),0.4)] flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </Link>
            <Link 
              href="/request-help" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <LifeBuoy className="h-5 w-5" />
              Request Help
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-12 text-gray-300 text-sm font-medium">
            <Link href="/volunteer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Users className="h-4 w-4" /> Become a Volunteer <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <Link href="/projects" className="flex items-center gap-2 hover:text-white transition-colors">
              View Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
