"use client";

import { useState } from "react";
import { updateRequestStatus } from "@/app/admin/adminActions";
import { Loader2 } from "lucide-react";

const statuses = [
  "PENDING",
  "UNDER_VERIFICATION",
  "APPROVED",
  "VOLUNTEER_ASSIGNED",
  "HELP_DISPATCHED",
  "COMPLETED",
  "REJECTED"
];

import { useRouter } from "next/navigation";

export default function RequestStatusDropdown({ requestId, currentStatus }: { requestId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const res = await updateRequestStatus(requestId, newStatus);
      if (!res.success) throw new Error(res.error || "Failed to update");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
      setStatus(currentStatus); // revert
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className="px-2.5 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer appearance-none pr-6"
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
        ))}
      </select>
      {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground absolute right-2" />}
    </div>
  );
}
