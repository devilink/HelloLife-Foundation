"use client";

import { useState } from "react";
import { addGalleryImage } from "@/app/admin/adminActions";
import { X, Loader2, Upload } from "lucide-react";

export default function GalleryFormModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    category: "General Impact",
    type: "IMAGE"
  });

  const categories = ["General Impact", "Food Distribution", "Medical Camp", "Rescue Operations", "Shelter Rebuilding"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      alert("Please select an image");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addGalleryImage({
        ...formData,
        url: imageBase64
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Upload Gallery Image</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Title *</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image File *</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imageBase64 ? (
                <div className="text-center">
                  <p className="text-sm text-primary font-medium">Image selected</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 5MB</p>
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
              Upload Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
