"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackHelpRequest } from "@/app/actions";

type Status = "PENDING" | "UNDER_VERIFICATION" | "APPROVED" | "VOLUNTEER_ASSIGNED" | "HELP_DISPATCHED" | "COMPLETED" | "REJECTED";

const statuses = [
  { id: "PENDING", label: "Pending", desc: "Request received" },
  { id: "UNDER_VERIFICATION", label: "Verifying", desc: "Admin review" },
  { id: "APPROVED", label: "Approved", desc: "Help authorized" },
  { id: "VOLUNTEER_ASSIGNED", label: "Assigned", desc: "Volunteer selected" },
  { id: "HELP_DISPATCHED", label: "Dispatched", desc: "Help is on the way" },
  { id: "COMPLETED", label: "Completed", desc: "Relief delivered" },
];

export default function RequestTracker() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setError("");
    setResult(null);

    startTransition(async () => {
      const data = await trackHelpRequest(searchId);
      if (data) {
        setResult(data);
      } else {
        setError("Request ID not found. Please check and try again.");
      }
    });
  };

  const getStatusIndex = (status: string) => {
    return statuses.findIndex(s => s.id === status);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Track Help Request</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your 6-digit Request ID to see real-time updates on your emergency request, volunteer assignment, and dispatch status.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. REQ-123456" 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-medium uppercase transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending || !searchId}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
          >
            {isPending ? <span className="animate-pulse">Searching...</span> : "Track Status"}
          </button>
        </form>
        {error && (
          <p className="text-destructive font-medium mt-4 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg"
        >
          <div className="p-6 md:p-8 bg-muted/30 border-b border-border flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Request ID</p>
              <h2 className="text-2xl font-bold font-mono text-foreground">{result.id}</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> {result.date}
              </div>
              <div className="flex items-center gap-2 font-medium text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <AlertCircle className="h-4 w-4" /> {statuses.find(s => s.id === result.status)?.label || "Unknown"}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b border-border pb-2">Request Details</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-muted-foreground">{result.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Requested By</p>
                    <p className="text-muted-foreground">{result.name}</p>
                  </div>
                </div>
              </div>

              {result.volunteer && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Assigned Volunteer</h3>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="font-medium text-foreground">{result.volunteer.name}</p>
                    <p className="text-sm text-muted-foreground">{result.volunteer.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-10">
              <h3 className="font-semibold text-foreground border-b border-border pb-4 mb-8">Status Timeline</h3>
              
              <div className="relative">
                <div className="absolute left-4 md:left-[50%] top-0 bottom-0 w-0.5 bg-muted -translate-x-[1px]"></div>
                
                <div className="space-y-8 relative">
                  {statuses.map((status, idx) => {
                    const currentIndex = getStatusIndex(result.status);
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    
                    return (
                      <div key={status.id} className="relative flex items-center md:justify-center">
                        <div className={cn(
                          "absolute left-4 md:left-[50%] w-4 h-4 rounded-full border-2 -translate-x-[7px] z-10 transition-colors",
                          isCompleted ? "bg-primary border-primary" : "bg-background border-muted",
                          isCurrent && "ring-4 ring-primary/20"
                        )} />
                        
                        <div className="flex w-full md:w-auto">
                          <div className={cn(
                            "ml-12 md:ml-0 md:w-1/2 md:pr-12 md:text-right transition-opacity",
                            isCompleted ? "opacity-100" : "opacity-40"
                          )}>
                            <p className={cn("font-bold", isCompleted ? "text-foreground" : "text-muted-foreground")}>{status.label}</p>
                            <p className="text-sm text-muted-foreground">{status.desc}</p>
                          </div>
                          <div className="hidden md:block w-1/2 pl-12" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {result.adminRemarks && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-semibold">
                  <Clock className="h-5 w-5" /> Latest Update
                </div>
                <p className="text-amber-900 dark:text-amber-200">
                  {result.adminRemarks}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
