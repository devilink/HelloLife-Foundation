"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, User, Phone, MapPin, Truck, Calendar, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { submitVolunteerApplication } from "@/app/actions";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  district: z.string().min(2, "District is required"),
  vehicleType: z.string().optional(),
  availability: z.string().optional(),
});

export default function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await submitVolunteerApplication(values);
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-10 text-center shadow-lg"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for stepping up to help. We have received your details and our coordinator will contact you shortly to assign you to a relief zone.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md inline-block"
        >
          Return to Homepage
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Become a Volunteer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We rely on the strength of our volunteers to deliver aid, rescue stranded families, and rebuild communities. Register below to join the effort.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Full Name <span className="text-destructive">*</span>
              </label>
              <input 
                {...register("fullName")}
                className={cn("w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all", errors.fullName ? "border-destructive" : "border-input")} 
                placeholder="Your Full Name" 
              />
              {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Phone Number <span className="text-destructive">*</span>
              </label>
              <input 
                {...register("phoneNumber")}
                className={cn("w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all", errors.phoneNumber ? "border-destructive" : "border-input")} 
                placeholder="10-digit number" 
              />
              {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
              <input 
                {...register("email")}
                type="email"
                className={cn("w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all", errors.email ? "border-destructive" : "border-input")} 
                placeholder="you@example.com" 
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> District / Region <span className="text-destructive">*</span>
              </label>
              <input 
                {...register("district")}
                className={cn("w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all", errors.district ? "border-destructive" : "border-input")} 
                placeholder="Where can you volunteer?" 
              />
              {errors.district && <p className="text-destructive text-sm">{errors.district.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Vehicle Type (Optional)
              </label>
              <select 
                {...register("vehicleType")}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              >
                <option value="">None / Not Applicable</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Car / SUV">Car / SUV</option>
                <option value="Pickup Truck / Van">Pickup Truck / Van</option>
                <option value="Boat">Boat / Raft</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Availability (Optional)
              </label>
              <select 
                {...register("availability")}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              >
                <option value="">Anytime</option>
                <option value="Weekends Only">Weekends Only</option>
                <option value="Weekdays Only">Weekdays Only</option>
                <option value="Evenings Only">Evenings Only</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 mt-4"
          >
            {isSubmitting ? "Submitting Application..." : "Join as Volunteer"}
          </button>
        </form>
      </div>
    </div>
  );
}
