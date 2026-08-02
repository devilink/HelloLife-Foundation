"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function TopDonors() {
  return (
    <section className="pb-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Donors */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">TOP DONATORS (ALL TIME)</h3>
              <Link href="/transparency" className="text-[11px] text-sky-600 font-medium hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-amber-500">1</span> 
                  <span>Rajesh Sharma</span>
                </div>
                <span className="font-semibold">₹ 25,00,000</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-slate-400">2</span> 
                  <span>Priya Verma</span>
                </div>
                <span className="font-semibold">₹ 18,00,000</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-amber-700">3</span> 
                  <span>Amit Kumar</span>
                </div>
                <span className="font-semibold">₹ 12,00,000</span>
              </div>
            </div>
          </div>

          {/* Monthly Supporters */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">MONTHLY SUPPORTERS</h3>
              <Link href="/transparency" className="text-[11px] text-sky-600 font-medium hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" /> 
                  <span>Arjun Patel</span>
                </div>
                <span className="text-slate-500">14 months</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" /> 
                  <span>Sneha Reddy</span>
                </div>
                <span className="text-slate-500">12 months</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" /> 
                  <span>Karan Mehta</span>
                </div>
                <span className="text-slate-500">11 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
