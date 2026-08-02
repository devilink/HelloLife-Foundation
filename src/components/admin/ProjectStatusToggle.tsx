"use client";

import { useState } from "react";
import { updateProjectStatus } from "@/app/admin/adminActions";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function ProjectStatusToggle({ projectId, currentStatus }: { projectId: string, currentStatus: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const toggle = async () => {
    const newStatus = status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
    setIsUpdating(true);
    try {
      const res = await updateProjectStatus(projectId, newStatus);
      if (!res.success) throw new Error(res.error || "Failed to update");
      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isUpdating}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
        status === "ACTIVE" 
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20" 
          : "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20",
        isUpdating && "opacity-50 pointer-events-none"
      )}
    >
      {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
      {status}
    </button>
  );
}
