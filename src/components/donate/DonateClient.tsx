"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, CheckCircle2, Heart, Landmark, QrCode, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function DonateClient() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const paymentInfo = {
    upiId: "hellolifefdn@sbi",
    bankName: "State Bank of India",
    accountName: "Hellolife Foundation",
    accountNumber: "42665264603",
    ifsc: "SBIN0011527"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight flex items-center justify-center gap-4 text-foreground">
          <Heart className="h-12 w-12 text-primary" />
          Support Our Mission
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your contribution directly helps families affected by floods. 100% of your donation goes towards relief efforts and is publicly accounted for.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 max-w-5xl mx-auto">
        {/* UPI Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl shadow-black/5 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold mb-8 text-foreground">Donate via UPI</h2>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/QR code.jpeg" 
              alt="UPI QR Code"
              width={224}
              height={224} 
              className="w-56 h-56 object-contain"
            />
          </div>
          
          <div className="w-full space-y-6 mt-auto">
            <div className="bg-muted/50 rounded-2xl p-5 flex justify-between items-center border border-border">
              <div className="text-left">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">UPI ID</p>
                <p className="font-mono font-bold text-xl text-foreground">{paymentInfo.upiId}</p>
              </div>
              <button 
                onClick={() => handleCopy(paymentInfo.upiId, "upi")}
                className="p-3 bg-background border border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
                title="Copy UPI ID"
              >
                {copiedId === "upi" ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6 text-muted-foreground" />}
              </button>
            </div>
            
            <button className="w-full py-4 flex items-center justify-center gap-2 border-2 border-primary/20 bg-primary/5 text-primary font-bold text-lg rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <Download className="h-6 w-6" /> Download QR Code
            </button>
          </div>
        </motion.div>

        {/* Bank Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl shadow-black/5 flex flex-col items-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="w-20 h-20 bg-secondary/10 rounded-[2rem] flex items-center justify-center mb-8">
            <Landmark className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-extrabold mb-8 text-foreground text-center">Bank Transfer</h2>
          
          <div className="w-full space-y-4 flex-1 bg-muted/20 p-8 rounded-[2rem] border border-border">
            <div className="flex flex-col mb-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Bank Name</span>
              <span className="font-bold text-xl text-foreground">{paymentInfo.bankName}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Account Name</span>
              <span className="font-bold text-xl text-foreground">{paymentInfo.accountName}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Account Number</span>
              <span className="font-mono font-bold text-2xl text-primary tracking-wider">{paymentInfo.accountNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">IFSC Code</span>
              <span className="font-mono font-bold text-xl text-foreground">{paymentInfo.ifsc}</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleCopy(`Name: ${paymentInfo.accountName}\nAcc: ${paymentInfo.accountNumber}\nIFSC: ${paymentInfo.ifsc}`, "bank")}
            className="w-full mt-6 py-4 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
          >
            {copiedId === "bank" ? (
              <><CheckCircle2 className="h-6 w-6" /> Copied Details</>
            ) : (
              <><Copy className="h-6 w-6" /> Copy Bank Details</>
            )}
          </button>
        </motion.div>
      </div>

    </div>
  );
}
