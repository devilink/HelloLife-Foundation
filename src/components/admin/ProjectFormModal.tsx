"use client";

import { useState } from "react";
import { createProject } from "@/app/admin/adminActions";
import { X, Loader2, Upload } from "lucide-react";

export default function ProjectFormModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    location: "",
    status: "ACTIVE"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;
              const max_size = 1200;
              
              if (width > height && width > max_size) {
                height *= max_size / width;
                width = max_size;
              } else if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.7)); // compress to 70% quality jpeg
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(promises).then(results => {
        setImagesBase64(results);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject({
        ...formData,
        goal: parseFloat(formData.goal),
        images: imagesBase64
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Add New Project</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Goal Amount (₹) *</label>
              <input required type="number" name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Images</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagesBase64.length > 0 ? (
                <div className="text-center">
                  <p className="text-sm text-primary font-medium">{imagesBase64.length} images selected</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Click to upload images</p>
                  <p className="text-xs text-muted-foreground mt-1">Select multiple JPEG, PNG files</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
