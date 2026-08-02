"use client";

import { useState } from "react";
import { addExpense } from "@/app/admin/adminActions";
import { X, Loader2, Upload } from "lucide-react";
import Image from "next/image";

export default function ExpenseFormModal({ onClose, projects = [] }: { onClose: () => void, projects?: { id: string; name: string }[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptBase64, setReceiptBase64] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Medical",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    description: "",
    projectId: "",
  });

  const categories = ["Medical", "Food", "Rescue", "Shelter", "Logistics", "Other"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        projectId: formData.projectId || undefined,
        receiptUrl: receiptBase64 // Storing the receipt as a Base64 string in the DB
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Log New Expense</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expense Title *</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₹) *</label>
              <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project (Optional)</label>
            <select name="projectId" value={formData.projectId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">General Expense (No Project)</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea rows={2} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Receipt</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {receiptBase64 ? (
                <div className="text-center">
                  <p className="text-sm text-primary font-medium">Receipt selected</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Click to upload receipt</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, or PDF</p>
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
              Log Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
