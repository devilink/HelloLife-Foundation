"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditDonationModal from "@/components/admin/EditDonationModal";
import DeleteAction from "@/components/admin/DeleteAction";

export default function DonationActions({ donation }: { donation: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Edit Donation"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <DeleteAction id={donation.id} entity="donationLedgerEntry" />
      </div>

      {isEditOpen && (
        <EditDonationModal 
          donation={donation} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </>
  );
}
