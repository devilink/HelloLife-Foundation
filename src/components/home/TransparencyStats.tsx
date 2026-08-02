"use client";

import { HandCoins, FolderOpen, Users, UserCog, Home } from "lucide-react";

interface StatsProps {
  totalRaised: string;
  totalExpenses: string;
  remainingBalance: string;
  activeProjects: string | number;
  completedProjects: string | number;
  peopleHelped: string | number;
  familiesHelped: string | number;
  volunteers: string | number;
  pendingRequests: string | number;
}

export default function TransparencyStats({ stats }: { stats: StatsProps }) {
  return (
    <div className="max-w-6xl mx-auto -mt-16 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-slate-100 p-8 md:p-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        
        <div className="flex flex-col items-center">
          <div className="text-emerald-500 bg-emerald-50 p-4 rounded-full mb-4"><HandCoins className="w-8 h-8 md:w-10 md:h-10" /></div>
          <div className="font-extrabold text-2xl md:text-3xl text-slate-800">₹ {stats.totalRaised}</div>
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold mt-2">Total Raised</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-sky-500 bg-sky-50 p-4 rounded-full mb-4"><FolderOpen className="w-8 h-8 md:w-10 md:h-10" /></div>
          <div className="font-extrabold text-2xl md:text-3xl text-slate-800">{Number(stats.activeProjects) + Number(stats.completedProjects)}</div>
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold mt-2">Active Projects</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-rose-500 bg-rose-50 p-4 rounded-full mb-4"><Users className="w-8 h-8 md:w-10 md:h-10" /></div>
          <div className="font-extrabold text-2xl md:text-3xl text-slate-800">{stats.peopleHelped}</div>
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold mt-2">People Helped</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-indigo-500 bg-indigo-50 p-4 rounded-full mb-4"><UserCog className="w-8 h-8 md:w-10 md:h-10" /></div>
          <div className="font-extrabold text-2xl md:text-3xl text-slate-800">{stats.volunteers}</div>
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold mt-2">Volunteers</div>
        </div>
        
        <div className="col-span-2 md:col-span-1 flex flex-col items-center">
          <div className="text-amber-500 bg-amber-50 p-4 rounded-full mb-4"><Home className="w-8 h-8 md:w-10 md:h-10" /></div>
          <div className="font-extrabold text-2xl md:text-3xl text-slate-800">{stats.familiesHelped}</div>
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold mt-2">Families Supported</div>
        </div>

      </div>
    </div>
  );
}
