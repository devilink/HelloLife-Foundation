"use client";

import { useState } from "react";
import OfflineDonorModal from "@/components/admin/OfflineDonorModal";

export default function DonationsClientHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donations Ledger</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Offline Donor
        </button>
      </div>

      {isModalOpen && <OfflineDonorModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
