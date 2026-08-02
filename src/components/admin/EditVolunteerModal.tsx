"use client";

import { useState } from "react";
import { updateVolunteer } from "@/app/admin/adminActions";
import { X, Loader2 } from "lucide-react";

export default function EditVolunteerModal({ 
  volunteer, 
  onClose 
}: { 
  volunteer: any; 
  onClose: () => void; 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: volunteer.fullName || "",
    phoneNumber: volunteer.phoneNumber || "",
    email: volunteer.email || "",
    district: volunteer.district || "",
    vehicleType: volunteer.vehicleType || "",
    availability: volunteer.availability || "Weekends",
    isActive: volunteer.isActive,
    completedTasks: volunteer.completedTasks?.toString() || "0"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateVolunteer(volunteer.id, {
        ...formData,
        completedTasks: parseInt(formData.completedTasks)
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update volunteer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Volunteer</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name *</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">District *</label>
            <input required name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <input name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <select name="availability" value={formData.availability} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
                <option value="Anytime">Anytime</option>
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Evenings">Evenings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tasks Completed</label>
              <input type="number" name="completedTasks" value={formData.completedTasks} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2 flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input 
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleToggle}
                  className="w-5 h-5 text-primary border-border focus:ring-primary/50 rounded"
                />
                <span className="text-sm font-medium">Active Volunteer</span>
              </label>
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
