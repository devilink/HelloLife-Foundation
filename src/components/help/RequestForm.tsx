"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, UploadCloud, HeartPulse, Utensils, ShieldAlert, Tent, Home, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { submitHelpRequest } from "@/app/actions";
import { motion } from "framer-motion";

const categories = [
  { id: "FOOD", name: "Food & Water", icon: Utensils },
  { id: "MEDICAL", name: "Medical Aid", icon: HeartPulse },
  { id: "SHELTER", name: "Shelter / Rescue", icon: Tent },
  { id: "RESCUE", name: "Emergency Rescue", icon: ShieldAlert },
  { id: "OTHER", name: "Other Assistance", icon: Home },
];

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  alternateContact: z.string().optional(),
  district: z.string().min(2, "District is required"),
  village: z.string().min(2, "Village/Town is required"),
  address: z.string().min(10, "Complete address is required"),
  pinCode: z.string().min(6, "Valid PIN code required"),
  emergencyType: z.string().min(1, "Please specify emergency type"),
  description: z.string().min(10, "Please describe the situation"),
  familyMembers: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  seniorCitizens: z.coerce.number().min(0),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  consent: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

export default function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      familyMembers: 1,
      children: 0,
      seniorCitizens: 0,
      urgency: "HIGH",
    }
  });

  const selectedCategory = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + newFiles.length > 5) {
        alert("You can only upload up to 5 files.");
        return;
      }
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const attachments = [];
      for (const file of selectedFiles) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = error => reject(error);
        });
        attachments.push({
          filename: file.name,
          content: base64,
        });
      }

      const result = await submitHelpRequest(values, attachments);
      if (result.success && result.id) {
        setRequestId(result.id);
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (requestId) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-[2.5rem] p-12 text-center shadow-xl shadow-black/5"
        >
          <div className="w-28 h-28 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">Request Submitted</h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Your request for help has been registered in our system. Our volunteer coordination team is reviewing it immediately.
          </p>
          
          <div className="bg-muted/50 p-8 rounded-2xl mb-10 border border-border">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Your Request ID</p>
            <p className="text-4xl font-mono font-black text-primary tracking-widest">{requestId}</p>
          </div>

          <Link 
            href="/" 
            className="w-full py-5 bg-secondary text-secondary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-border bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base outline-none font-medium";

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-foreground">Request Assistance</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Fill out this form to request emergency relief, medical aid, or shelter. We will dispatch assistance as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden">
        
        {/* Category Selection Full Width */}
        <div className="p-8 md:p-12 border-b border-border bg-muted/10">
          <h3 className="text-2xl font-bold mb-6 text-foreground">1. What kind of help do you need?</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setValue("category", cat.id)}
                className={cn(
                  "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-1",
                  selectedCategory === cat.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border bg-background hover:border-primary/40 hover:shadow-sm"
                )}
              >
                <div className={cn("p-3 rounded-xl", selectedCategory === cat.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className={cn("font-bold text-sm", selectedCategory === cat.id ? "text-primary" : "text-muted-foreground")}>{cat.name}</span>
              </div>
            ))}
          </div>
          {errors.category && <p className="text-destructive font-semibold mt-4">{errors.category.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          
          {/* LEFT SIDE: Personal Information */}
          <div className="p-8 md:p-12 space-y-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">2. Personal & Location Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
                <input {...register("fullName")} className={inputClass} placeholder="Enter your full name" />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Phone Number</label>
                  <input {...register("phoneNumber")} className={inputClass} placeholder="Primary contact" />
                  {errors.phoneNumber && <p className="text-destructive text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Alternate Contact</label>
                  <input {...register("alternateContact")} className={inputClass} placeholder="Secondary contact (optional)" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Family Size</label>
                  <input type="number" {...register("familyMembers")} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Children</label>
                  <input type="number" {...register("children")} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Seniors</label>
                  <input type="number" {...register("seniorCitizens")} className={inputClass} />
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">District</label>
                    <input {...register("district")} className={inputClass} placeholder="E.g. Wayanad" />
                    {errors.district && <p className="text-destructive text-sm mt-1">{errors.district.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Village/Town</label>
                    <input {...register("village")} className={inputClass} placeholder="Local area" />
                    {errors.village && <p className="text-destructive text-sm mt-1">{errors.village.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Complete Address / Landmark</label>
                  <textarea {...register("address")} rows={3} className={cn(inputClass, "resize-none")} placeholder="Provide detailed directions..." />
                  {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">PIN Code</label>
                  <input {...register("pinCode")} className={inputClass} placeholder="Postal code" />
                  {errors.pinCode && <p className="text-destructive text-sm mt-1">{errors.pinCode.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Emergency Details & Uploads */}
          <div className="p-8 md:p-12 space-y-8 bg-muted/5">
            <h3 className="text-2xl font-bold text-foreground mb-2">3. Emergency Details & Uploads</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Emergency Type</label>
                  <select {...register("emergencyType")} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Flood Water Entering Home">Flood Water Entering Home</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Stranded - Need Rescue">Stranded - Need Rescue</option>
                    <option value="No Food / Drinking Water">No Food / Drinking Water</option>
                  </select>
                  {errors.emergencyType && <p className="text-destructive text-sm mt-1">{errors.emergencyType.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Urgency Level</label>
                  <select {...register("urgency")} className={inputClass}>
                    <option value="LOW">Low (Can wait 24hrs)</option>
                    <option value="MEDIUM">Medium (Need help today)</option>
                    <option value="HIGH">High (Urgent within hours)</option>
                    <option value="CRITICAL">Critical (Life Threatening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Describe the situation</label>
                <textarea {...register("description")} rows={5} className={cn(inputClass, "resize-none")} placeholder="Please provide specific details about what you need immediately..." />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Upload Photos / Videos (Max 5)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer flex flex-col items-center"
                >
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <span className="font-bold text-primary mb-1">Click to upload media</span>
                  <span className="text-sm font-medium text-primary/70">Helps us assess the situation better.</span>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border shadow-sm text-sm">
                        <span className="truncate font-medium max-w-[200px]">{file.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground font-semibold text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <button 
                            type="button" 
                            onClick={() => removeFile(idx)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border">
                <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl bg-background border border-border">
                  <input type="checkbox" {...register("consent")} className="mt-1 w-5 h-5 text-secondary rounded border-border focus:ring-secondary/50 flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground leading-relaxed">
                    I consent to sharing this information with the Hello Life Foundation and its volunteers for the purpose of receiving humanitarian assistance.
                  </span>
                </label>
                {errors.consent && <p className="text-destructive font-semibold text-sm mt-2">{errors.consent.message as string}</p>}
              </div>

            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 border-t border-border bg-background flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-5 bg-secondary text-secondary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? "Submitting Request..." : "Submit Emergency Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
