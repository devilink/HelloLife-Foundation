"use client";

import { useState } from "react";
import VolunteerFormModal from "@/components/admin/VolunteerFormModal";

export default function VolunteersClientHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Volunteer
        </button>
      </div>

      {isModalOpen && <VolunteerFormModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
