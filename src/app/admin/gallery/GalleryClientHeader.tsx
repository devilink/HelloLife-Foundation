"use client";

import { useState } from "react";
import GalleryFormModal from "@/components/admin/GalleryFormModal";

export default function GalleryClientHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Impact Gallery</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Upload Image
        </button>
      </div>

      {isModalOpen && <GalleryFormModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
