"use client";

import { Banknote, CreditCard, Wallet, AlertCircle, CheckCircle, FolderOpen, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AdminDashboardClient({ stats: data }: { stats: any }) {
  const stats = [
    { label: "Total Raised", value: data.totalRaised, icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Expenses", value: data.totalExpenses, icon: CreditCard, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Pending Requests", value: data.pendingRequests, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Requests", value: data.completedRequests, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Projects", value: data.activeProjects, icon: FolderOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Volunteers", value: data.totalVolunteers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
