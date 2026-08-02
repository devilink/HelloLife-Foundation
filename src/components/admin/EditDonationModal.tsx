"use client";

import { useState } from "react";
import { updateDonation } from "@/app/admin/adminActions";
import { X, Loader2 } from "lucide-react";

export default function EditDonationModal({ 
  donation, 
  onClose 
}: { 
  donation: any; 
  onClose: () => void; 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    donorName: donation.donorName || "",
    amount: donation.amount?.toString() || "",
    paymentDate: new Date(donation.paymentDate).toISOString().split("T")[0],
    paymentMethod: donation.paymentMethod || "UPI",
    transactionId: donation.transactionId || "",
    anonymous: donation.anonymous || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, anonymous: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateDonation(donation.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Donation Ledger Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Donor Name *</label>
            <input required name="donorName" value={formData.donorName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleToggle}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">Keep donation anonymous</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₹) *</label>
              <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date *</label>
              <input required type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method *</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50">
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction ID</label>
              <input name="transactionId" value={formData.transactionId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" placeholder="Optional" />
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
