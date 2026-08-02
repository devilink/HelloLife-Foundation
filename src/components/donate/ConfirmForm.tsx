"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, UploadCloud, Info, AlertCircle } from "lucide-react";
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-12 bg-card border border-border rounded-2xl text-center shadow-lg"
      >
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Verification Pending</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for submitting your donation details. Our administrators will verify the transaction within 24-48 hours. Once verified, it will appear on our transparency ledger.
        </p>
        <Link 
          href="/transparency" 
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          View Transparency Dashboard
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Submit Donation Details</h1>
        <p className="text-muted-foreground">
          Fill out this form after you have completed your payment. 
          Upload a screenshot of the successful transaction for faster verification.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80 font-medium">
            This form does NOT deduct money from your account. It is only used to record and verify manual donations for our transparency dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
              <input 
                {...register("fullName")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.fullName ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
                placeholder="Enter your name" 
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></label>
              <input 
                {...register("phoneNumber")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.phoneNumber ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
                placeholder="10-digit number" 
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address (Optional)</label>
              <input 
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="you@example.com" 
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Donation Amount (₹) <span className="text-destructive">*</span></label>
              <input 
                {...register("amount")}
                type="number"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.amount ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
                placeholder="e.g. 5000" 
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date <span className="text-destructive">*</span></label>
              <input 
                {...register("paymentDate")}
                type="date"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.paymentDate ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
              />
              {errors.paymentDate && <p className="text-sm text-destructive">{errors.paymentDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Method <span className="text-destructive">*</span></label>
              <select 
                {...register("paymentMethod")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none",
                  errors.paymentMethod ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">Bank Transfer (NEFT/IMPS)</option>
                <option value="CASH">Cash Deposit</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction ID / UTR <span className="text-destructive">*</span></label>
              <input 
                {...register("transactionId")}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.transactionId ? "border-destructive focus:ring-destructive/50" : "border-input"
                )} 
                placeholder="12-digit number" 
              />
              {errors.transactionId && <p className="text-sm text-destructive">{errors.transactionId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Screenshot <span className="text-destructive">*</span></label>
            <div className="border-2 border-dashed border-input rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/50 transition-colors">
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
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                {screenshot ? (
                  <span className="text-primary font-medium">{screenshot.name}</span>
                ) : (
                  <>
                    <span className="font-medium mb-1">Click to upload screenshot</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message (Optional)</label>
            <textarea 
              {...register("message")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" 
              placeholder="Leave a message for our team..." 
            />
          </div>

          <div className="bg-muted p-5 rounded-xl space-y-4">
            <p className="font-semibold text-sm">Privacy Options</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                value="false" 
                {...register("isAnonymous")} 
                defaultChecked 
                className="w-4 h-4 text-primary focus:ring-primary/50"
              />
              <span className="text-sm">Display my name publicly on the Recognition Wall</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                value="true" 
                {...register("isAnonymous")} 
                className="w-4 h-4 text-primary focus:ring-primary/50"
              />
              <span className="text-sm">Keep my donation completely anonymous</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
