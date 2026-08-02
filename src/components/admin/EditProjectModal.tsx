"use client";

import { useState } from "react";
import { updateProject } from "@/app/admin/adminActions";
import { X, Loader2, Upload } from "lucide-react";

export default function EditProjectModal({ 
  project, 
  onClose 
}: { 
  project: any; 
  onClose: () => void; 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageBase64, setCoverImageBase64] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    goal: project.goal?.toString() || "",
    raised: project.raised?.toString() || "0",
    expensesTotal: project.expensesTotal?.toString() || "0",
    supportersCount: project.supportersCount?.toString() || "0",
    location: project.location || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProject(project.id, {
        ...formData,
        goal: parseFloat(formData.goal),
        raised: parseFloat(formData.raised),
        expensesTotal: parseFloat(formData.expensesTotal),
        supportersCount: parseInt(formData.supportersCount),
        coverImage: coverImageBase64 || undefined
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Raised (₹)</label>
              <input type="number" name="raised" value={formData.raised} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Expenses (₹)</label>
              <input type="number" name="expensesTotal" value={formData.expensesTotal} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Supporters</label>
            <input type="number" name="supportersCount" value={formData.supportersCount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Update Cover Image (Optional)</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {coverImageBase64 ? (
                <div className="text-center">
                  <p className="text-sm text-primary font-medium">New image selected</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Click to upload new cover image</p>
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current image</p>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
