"use client";

import { useState } from "react";
import { updateSettingsBulk } from "@/app/admin/adminActions";
import { Save, Loader2 } from "lucide-react";
export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    totalRaised: initialSettings.totalRaised || "0",
    totalExpenses: initialSettings.totalExpenses || "0",
    remainingBalance: initialSettings.remainingBalance || "0",
    totalVolunteers: initialSettings.totalVolunteers || "0",
    familiesHelped: initialSettings.familiesHelped || "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateSettingsBulk(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Funds Raised (Manual Override)</label>
            <input 
              name="totalRaised"
              value={settings.totalRaised}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">Format as you want it displayed (e.g., "₹1,25,00,000" or "1.25 Cr")</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total Expenses (Manual Override)</label>
            <input 
              name="totalExpenses"
              value={settings.totalExpenses}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">Format as you want it displayed (e.g., "₹84,50,000")</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Remaining Balance (Manual Override)</label>
            <input 
              name="remainingBalance"
              value={settings.remainingBalance}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total Volunteers</label>
            <input 
              name="totalVolunteers"
              type="text"
              value={settings.totalVolunteers}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Families Helped</label>
            <input 
              name="familiesHelped"
              type="text"
              value={settings.familiesHelped}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Settings
        </button>
      </div>
    </form>
  );
}
