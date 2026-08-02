"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, CheckCircle2, Heart, Landmark, QrCode } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DonateClient() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const paymentInfo = {
    upiId: "hellolife@sbi",
    bankName: "State Bank of India",
    accountName: "Hello Life Foundation",
    accountNumber: "3192000100123456",
    ifsc: "SBIN0001234"
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-primary fill-primary/20" />
          Support Our Mission
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your contribution directly helps families affected by floods. 100% of your donation goes towards relief efforts and is publicly accounted for.
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-12 text-center max-w-2xl mx-auto">
        <p className="text-amber-800 dark:text-amber-300 font-medium">
          After making your donation, you may submit your payment details below for verification and inclusion in our transparency dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* UPI Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-6">Donate via UPI</h2>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
              alt="UPI QR Code" 
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <div className="w-full space-y-4">
            <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">UPI ID</p>
                <p className="font-mono font-medium text-lg">{paymentInfo.upiId}</p>
              </div>
              <button 
                onClick={() => handleCopy(paymentInfo.upiId, "upi")}
                className="p-2 hover:bg-background rounded-md transition-colors"
                title="Copy UPI ID"
              >
                {copiedId === "upi" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
              </button>
            </div>
            
            <button className="w-full py-3 flex items-center justify-center gap-2 border-2 border-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors">
              <Download className="h-5 w-5" /> Download QR Code
            </button>
          </div>
        </motion.div>

        {/* Bank Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Landmark className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-6">Bank Transfer (NEFT/IMPS)</h2>
          
          <div className="w-full space-y-3 flex-1">
            <div className="flex justify-between items-center p-3 border-b border-border">
              <span className="text-muted-foreground">Bank Name</span>
              <span className="font-medium text-right">{paymentInfo.bankName}</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-border">
              <span className="text-muted-foreground">Account Name</span>
              <span className="font-medium text-right">{paymentInfo.accountName}</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-border">
              <span className="text-muted-foreground">Account Number</span>
              <span className="font-mono font-medium text-right">{paymentInfo.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-border">
              <span className="text-muted-foreground">IFSC Code</span>
              <span className="font-mono font-medium text-right">{paymentInfo.ifsc}</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleCopy(`Name: ${paymentInfo.accountName}\nAcc: ${paymentInfo.accountNumber}\nIFSC: ${paymentInfo.ifsc}`, "bank")}
            className="w-full mt-8 py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            {copiedId === "bank" ? (
              <><CheckCircle2 className="h-5 w-5" /> Copied Details</>
            ) : (
              <><Copy className="h-5 w-5" /> Copy Bank Details</>
            )}
          </button>
        </motion.div>
      </div>

      <div className="text-center bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h3 className="text-2xl font-bold mb-4">Have you already donated?</h3>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Help us maintain our 100% transparency promise. Submit your donation details below so our admins can verify and update the public ledger.
        </p>
        <Link 
          href="/donate/confirm" 
          className="inline-block px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-colors shadow-sm border border-border"
        >
          Submit Donation Details
        </Link>
      </div>
    </div>
  );
}
