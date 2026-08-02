"use client";

import { useState } from "react";
import { Search, Filter, Download, FileText, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  district: string;
  approvedBy: string;
};

type Stats = {
  totalRaised: string;
  totalExpenses: string;
  remainingBalance: string;
};

export default function TransparencyDashboard({ initialExpenses, stats }: { initialExpenses: Expense[], stats: Stats }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = ["ALL", "Medical", "Food", "Rescue", "Shelter", "Food & Water"];

  const filteredExpenses = initialExpenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-foreground">Financial Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We maintain a 100% open ledger. Every donation received and every rupee spent is documented here for public verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[2.5rem] p-10 text-center shadow-lg shadow-black/5"
        >
          <p className="text-primary font-bold text-lg mb-3 tracking-wide">Total Raised</p>
          <h2 className="text-5xl font-black text-foreground">{stats.totalRaised}</h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[2.5rem] p-10 text-center shadow-lg shadow-black/5"
        >
          <p className="text-rose-500 font-bold text-lg mb-3 tracking-wide">Total Expenses</p>
          <h2 className="text-5xl font-black text-foreground">{stats.totalExpenses}</h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/10 border border-secondary/20 rounded-[2.5rem] p-10 text-center shadow-lg shadow-secondary/5"
        >
          <p className="text-secondary-foreground font-bold text-lg mb-3 tracking-wide">Remaining Balance</p>
          <h2 className="text-5xl font-black text-secondary">{stats.remainingBalance}</h2>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden"
      >
        <div className="p-8 md:p-10 border-b border-border bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-6">
          <h3 className="text-3xl font-bold text-foreground">Expense Ledger</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>
            
            <div className="relative w-full sm:w-56">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-12 pr-10 py-3 w-full rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-muted-foreground text-sm font-semibold tracking-wider uppercase border-b border-border">
                <th className="p-6 whitespace-nowrap">Date</th>
                <th className="p-6 whitespace-nowrap">Expense Title</th>
                <th className="p-6 whitespace-nowrap">Category</th>
                <th className="p-6 whitespace-nowrap">Location</th>
                <th className="p-6 whitespace-nowrap text-right">Amount (₹)</th>
                <th className="p-6 whitespace-nowrap text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, idx) => (
                  <motion.tr 
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-6 whitespace-nowrap text-sm text-muted-foreground font-medium">{expense.date}</td>
                    <td className="p-6">
                      <p className="font-bold text-foreground mb-1 text-base">{expense.title}</p>
                      <p className="text-xs font-semibold text-muted-foreground tracking-wide">ID: {expense.id} • Appr: {expense.approvedBy}</p>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <span className="px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-wider">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-6 whitespace-nowrap text-sm font-medium text-muted-foreground">{expense.district}</td>
                    <td className="p-6 whitespace-nowrap text-right font-black text-lg text-foreground">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="p-6 whitespace-nowrap text-center">
                      <button className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/20 text-primary transition-colors">
                        <FileText className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                      <p className="text-xl font-bold text-muted-foreground">No expenses found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-xl text-sm font-bold hover:bg-border transition-colors shadow-sm">
            <Download className="h-5 w-5" /> Export PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}
