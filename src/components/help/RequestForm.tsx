"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, UploadCloud, MapPin, ChevronRight, ChevronLeft, HeartPulse, Home, Utensils, ShieldAlert, Tent, Phone, User, FileText, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { submitHelpRequest } from "@/app/actions";
import { useRef } from "react";

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
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<z.infer<typeof formSchema>>({
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

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["category"];
    if (step === 2) fieldsToValidate = ["fullName", "phoneNumber", "alternateContact", "familyMembers", "children", "seniorCitizens"];
    if (step === 3) fieldsToValidate = ["district", "village", "address", "pinCode"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + newFiles.length > 5) {
        alert("You can only upload up to 5 files.");
        return;
      }
      
      const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
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
      <div className="max-w-2xl mx-auto py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-10 text-center shadow-lg"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your request for help has been registered in our system. Our volunteer coordination team is reviewing it.
          </p>
          
          <div className="bg-muted p-6 rounded-2xl mb-8 border border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Request ID</p>
            <p className="text-4xl font-mono font-bold text-primary tracking-widest">{requestId}</p>
          </div>

          <Link 
            href="/" 
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Need Help?</h1>
        <p className="text-lg text-muted-foreground">
          Fill out this form to request emergency relief, medical aid, or shelter. We will dispatch assistance as soon as possible.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm",
                step >= i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
              )}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CATEGORY */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HeartPulse className="text-primary h-6 w-6" /> What kind of help do you need?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id}
                      onClick={() => setValue("category", cat.id)}
                      className={cn(
                        "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3",
                        selectedCategory === cat.id 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      )}
                    >
                      <cat.icon className={cn("h-8 w-8", selectedCategory === cat.id ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("font-semibold", selectedCategory === cat.id ? "text-foreground" : "text-muted-foreground")}>{cat.name}</span>
                    </div>
                  ))}
                </div>
                {errors.category && <p className="text-destructive text-sm font-medium">{errors.category.message as string}</p>}
              </motion.div>
            )}

            {/* STEP 2: PERSONAL DETAILS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="text-primary h-6 w-6" /> Personal Details
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input {...register("fullName")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <input {...register("phoneNumber")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                      {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alternate Contact</label>
                      <input {...register("alternateContact")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Family Size</label>
                      <input type="number" {...register("familyMembers")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Children</label>
                      <input type="number" {...register("children")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Seniors</label>
                      <input type="number" {...register("seniorCitizens")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LOCATION */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-primary h-6 w-6" /> Location Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">District</label>
                    <input {...register("district")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    {errors.district && <p className="text-destructive text-sm">{errors.district.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Village/Town</label>
                    <input {...register("village")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                    {errors.village && <p className="text-destructive text-sm">{errors.village.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Complete Address / Landmark</label>
                  <textarea {...register("address")} rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
                  {errors.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">PIN Code</label>
                  <input {...register("pinCode")} className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                  {errors.pinCode && <p className="text-destructive text-sm">{errors.pinCode.message}</p>}
                </div>
              </motion.div>
            )}

            {/* STEP 4: EMERGENCY DETAILS */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="text-primary h-6 w-6" /> Emergency Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Type</label>
                    <select {...register("emergencyType")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                      <option value="">Select...</option>
                      <option value="Flood Water Entering Home">Flood Water Entering Home</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Stranded - Need Rescue">Stranded - Need Rescue</option>
                      <option value="No Food / Drinking Water">No Food / Drinking Water</option>
                    </select>
                    {errors.emergencyType && <p className="text-destructive text-sm">{errors.emergencyType.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Urgency Level</label>
                    <select {...register("urgency")} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                      <option value="LOW">Low (Can wait 24hrs)</option>
                      <option value="MEDIUM">Medium (Need help today)</option>
                      <option value="HIGH">High (Urgent within hours)</option>
                      <option value="CRITICAL">Critical (Life Threatening)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Describe the situation</label>
                  <textarea {...register("description")} rows={4} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
                  {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Photos / Videos (Max 5)</label>
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
                    className="border-2 border-dashed border-input rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center"
                  >
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                    <span className="font-medium mb-1">Click to upload media</span>
                    <span className="text-xs text-muted-foreground">Helps us assess the situation better.</span>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border text-sm">
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button 
                              type="button" 
                              onClick={() => removeFile(idx)}
                              className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register("consent")} className="mt-1 w-5 h-5 text-primary rounded border-input focus:ring-primary/50" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      I consent to sharing this information with the Hello Life Foundation and its volunteers for the purpose of receiving humanitarian assistance. I understand this information may be stored securely in the system.
                    </span>
                  </label>
                  {errors.consent && <p className="text-destructive text-sm mt-1">{errors.consent.message as string}</p>}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 font-semibold rounded-xl text-foreground hover:bg-muted transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button 
                type="button" 
                onClick={handleNextStep}
                className="px-8 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                Next Step <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-destructive text-destructive-foreground font-bold rounded-xl hover:bg-destructive/90 transition-all flex items-center gap-2 shadow-lg shadow-destructive/20 disabled:opacity-70"
              >
                {isSubmitting ? "Submitting Request..." : "Submit Emergency Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
