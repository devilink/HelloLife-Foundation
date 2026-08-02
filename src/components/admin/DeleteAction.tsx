"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteHelpRequest, deleteProject, deleteExpense, deleteGalleryImage, deleteVolunteer, deleteDonationLedgerEntry } from "@/app/admin/adminActions";

import { useRouter } from "next/navigation";

export default function DeleteAction({ id, entity }: { id: string, entity: "request" | "project" | "expense" | "galleryImage" | "volunteer" | "donationLedgerEntry" }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${entity}? This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      let res;
      if (entity === "request") res = await deleteHelpRequest(id);
      if (entity === "project") res = await deleteProject(id);
      if (entity === "expense") res = await deleteExpense(id);
      if (entity === "galleryImage") res = await deleteGalleryImage(id);
      if (entity === "volunteer") res = await deleteVolunteer(id);
      if (entity === "donationLedgerEntry") res = await deleteDonationLedgerEntry(id);
      
      if (res && !res.success) throw new Error(res.error || "Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
