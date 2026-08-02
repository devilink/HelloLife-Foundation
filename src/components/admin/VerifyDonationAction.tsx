"use client";

import { useState } from "react";
import { verifyDonation, rejectDonationConfirmation } from "@/app/admin/adminActions";
import { Check, X, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

export default function VerifyDonationAction({ confirmationId }: { confirmationId: string }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      const res = await verifyDonation(confirmationId);
      if (!res.success) throw new Error(res.error || "Failed to verify");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to verify");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this donation verification?")) return;
    setIsProcessing(true);
    try {
      const res = await rejectDonationConfirmation(confirmationId);
      if (!res.success) throw new Error(res.error || "Failed to reject");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleVerify}
        disabled={isProcessing}
        className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-md hover:bg-emerald-500/20 disabled:opacity-50"
        title="Verify and Add to Ledger"
      >
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button 
        onClick={handleReject}
        disabled={isProcessing}
        className="p-1.5 bg-rose-500/10 text-rose-600 rounded-md hover:bg-rose-500/20 disabled:opacity-50"
        title="Reject"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
