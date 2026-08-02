"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Banknote, CreditCard, Wallet, FolderOpen, CheckCircle, Home, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsProps {
  totalRaised: string;
  totalExpenses: string;
  remainingBalance: string;
  activeProjects: string | number;
  completedProjects: string | number;
  familiesHelped: string | number;
  volunteers: string | number;
  pendingRequests: string | number;
}

export default function TransparencyStats({ stats }: { stats: StatsProps }) {
  const statCards = [
    { label: "Total Funds Raised", value: stats.totalRaised, icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Expenses", value: stats.totalExpenses, icon: CreditCard, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Remaining Balance", value: stats.remainingBalance, icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderOpen, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Projects", value: stats.completedProjects, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Families Helped", value: stats.familiesHelped, icon: Home, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Volunteers", value: stats.volunteers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Transparency Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We believe in 100% financial transparency. Every donation and expense is accounted for and openly shared with our community.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className={cn("w-24 h-24 -mr-8 -mt-8", stat.color)} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
