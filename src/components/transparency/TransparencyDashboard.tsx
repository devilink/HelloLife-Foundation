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
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Financial Transparency</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We maintain a 100% open ledger. Every donation received and every rupee spent is documented here for public verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2">Total Raised</p>
          <h2 className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">{stats.totalRaised}</h2>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
          <p className="text-rose-700 dark:text-rose-400 font-semibold mb-2">Total Expenses</p>
          <h2 className="text-4xl font-bold text-rose-900 dark:text-rose-300">{stats.totalExpenses}</h2>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-primary font-semibold mb-2">Remaining Balance</p>
          <h2 className="text-4xl font-bold text-primary">{stats.remainingBalance}</h2>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-2xl font-bold">Expense Ledger</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 w-full sm:w-48 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm">
                <th className="p-4 font-medium whitespace-nowrap">Date</th>
                <th className="p-4 font-medium whitespace-nowrap">Expense Title</th>
                <th className="p-4 font-medium whitespace-nowrap">Category</th>
                <th className="p-4 font-medium whitespace-nowrap">Location</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Amount (₹)</th>
                <th className="p-4 font-medium whitespace-nowrap text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <motion.tr 
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap text-sm text-muted-foreground">{expense.date}</td>
                    <td className="p-4">
                      <p className="font-medium">{expense.title}</p>
                      <p className="text-xs text-muted-foreground">ID: {expense.id} • Appr: {expense.approvedBy}</p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-muted-foreground">{expense.district}</td>
                    <td className="p-4 whitespace-nowrap text-right font-bold text-foreground">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <button className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <FileText className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No expenses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
