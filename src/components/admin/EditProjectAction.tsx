"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditProjectModal from "./EditProjectModal";

export default function EditProjectAction({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
        title="Edit Project"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <EditProjectModal 
          project={project} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
