"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditVolunteerModal from "@/components/admin/EditVolunteerModal";
import DeleteAction from "@/components/admin/DeleteAction";

export default function VolunteerActions({ volunteer }: { volunteer: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Edit Volunteer"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <DeleteAction id={volunteer.id} entity="volunteer" />
      </div>

      {isEditOpen && (
        <EditVolunteerModal 
          volunteer={volunteer} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </>
  );
}
