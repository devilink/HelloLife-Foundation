"use client";

import { useState } from "react";
import ProjectFormModal from "@/components/admin/ProjectFormModal";

export default function ProjectsClientHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Project
        </button>
      </div>

      {isModalOpen && <ProjectFormModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
