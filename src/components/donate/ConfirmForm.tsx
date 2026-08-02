"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, UploadCloud, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { submitDonationConfirmation } from "@/app/actions";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Date is required"),
  paymentMethod: z.enum(["UPI", "NEFT", "IMPS", "CASH"]),
  transactionId: z.string().min(5, "Transaction ID/UTR is required"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export default function ConfirmForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAnonymous: false,
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await submitDonationConfirmation({
        ...values,
        isAnonymous: values.isAnonymous ? "true" : "false"
      });
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("Failed to submit donation details. Please try again.");
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
      <div className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto p-12 bg-card border border-border rounded-[2.5rem] text-center shadow-xl shadow-black/5"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-extrabold mb-6 text-foreground tracking-tight">Verification Pending</h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Thank you for submitting your donation details. Our administrators will verify the transaction within 24-48 hours. Once verified, it will appear on our transparency ledger.
          </p>
          <Link 
            href="/transparency" 
            className="inline-block px-10 py-5 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
          >
            View Financial Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-base";
  const errorInputClass = "border-destructive focus:border-destructive focus:ring-destructive/10";

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-foreground">Submit Donation Details</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Fill out this form after you have completed your payment. 
          Upload a screenshot of the successful transaction for faster verification.
        </p>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-6 md:p-8 bg-secondary/10 border-b border-secondary/20 flex items-start gap-4">
          <Info className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
          <p className="text-base text-secondary-foreground font-semibold leading-relaxed">
            This form does NOT deduct money from your account. It is only used to record and verify manual donations for our financial dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Full Name <span className="text-destructive">*</span></label>
              <input 
                {...register("fullName")}
                className={cn(inputClass, errors.fullName && errorInputClass)} 
                placeholder="Enter your name" 
              />
              {errors.fullName && <p className="text-sm font-semibold text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Phone Number <span className="text-destructive">*</span></label>
              <input 
                {...register("phoneNumber")}
                className={cn(inputClass, errors.phoneNumber && errorInputClass)} 
                placeholder="10-digit number" 
              />
              {errors.phoneNumber && <p className="text-sm font-semibold text-destructive">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Email Address (Optional)</label>
              <input 
                {...register("email")}
                type="email"
                className={cn(inputClass, errors.email && errorInputClass)} 
                placeholder="you@example.com" 
              />
              {errors.email && <p className="text-sm font-semibold text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Donation Amount (₹) <span className="text-destructive">*</span></label>
              <input 
                {...register("amount")}
                type="number"
                className={cn(inputClass, errors.amount && errorInputClass)} 
                placeholder="e.g. 5000" 
              />
              {errors.amount && <p className="text-sm font-semibold text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Payment Date <span className="text-destructive">*</span></label>
              <input 
                {...register("paymentDate")}
                type="date"
                className={cn(inputClass, errors.paymentDate && errorInputClass)} 
              />
              {errors.paymentDate && <p className="text-sm font-semibold text-destructive">{errors.paymentDate.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Method <span className="text-destructive">*</span></label>
              <select 
                {...register("paymentMethod")}
                className={cn(inputClass, "appearance-none", errors.paymentMethod && errorInputClass)} 
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">Bank Transfer (NEFT/IMPS)</option>
                <option value="CASH">Cash Deposit</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Transaction ID / UTR <span className="text-destructive">*</span></label>
              <input 
                {...register("transactionId")}
                className={cn(inputClass, errors.transactionId && errorInputClass)} 
                placeholder="12-digit number" 
              />
              {errors.transactionId && <p className="text-sm font-semibold text-destructive">{errors.transactionId.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Payment Screenshot <span className="text-destructive">*</span></label>
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center bg-primary/5 hover:bg-primary/10 transition-colors">
              <input 
                type="file" 
                id="screenshot" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setScreenshot(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="screenshot" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="h-12 w-12 text-primary mb-4" />
                {screenshot ? (
                  <span className="text-primary font-bold text-lg">{screenshot.name}</span>
                ) : (
                  <>
                    <span className="font-bold text-lg text-primary mb-1">Click to upload screenshot</span>
                    <span className="text-sm font-medium text-primary/70">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Message (Optional)</label>
            <textarea 
              {...register("message")}
              rows={4}
              className={cn(inputClass, "resize-none")} 
              placeholder="Leave a message for our team..." 
            />
          </div>

          <div className="bg-muted/30 p-8 rounded-[2rem] space-y-5 border border-border">
            <p className="font-extrabold text-foreground mb-2">Privacy Options</p>
            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl bg-background border border-border">
              <input 
                type="radio" 
                value="false" 
                {...register("isAnonymous")} 
                defaultChecked 
                className="w-5 h-5 text-primary focus:ring-primary/50 border-border"
              />
              <span className="text-sm font-medium text-muted-foreground">Display my name publicly on the Recognition Wall</span>
            </label>
            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl bg-background border border-border">
              <input 
                type="radio" 
                value="true" 
                {...register("isAnonymous")} 
                className="w-5 h-5 text-primary focus:ring-primary/50 border-border"
              />
              <span className="text-sm font-medium text-muted-foreground">Keep my donation completely anonymous</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 mt-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Submitting Details...</span>
            ) : (
              "Submit Donation for Verification"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
