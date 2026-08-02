"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";

interface Donor {
  id: string;
  donorName: string;
  amount: number;
  anonymous: boolean;
  paymentDate?: string | Date;
}

export default function TopDonors({ 
  topDonors = [], 
  recentDonors = [] 
}: { 
  topDonors?: Donor[]; 
  recentDonors?: Donor[]; 
}) {
  return (
    <section className="pb-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Donors (All Time) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">TOP DONATORS (ALL TIME)</h3>
              <Link href="/transparency" className="text-[11px] text-sky-600 font-medium hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              {topDonors.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 font-medium">
                  No donations recorded yet.
                </div>
              ) : (
                topDonors.map((donor, idx) => (
                  <div key={donor.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 text-center font-bold ${
                        idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-amber-700" : "text-slate-500"
                      }`}>
                        {idx + 1}
                      </span> 
                      <span className="font-semibold text-slate-800">
                        {donor.anonymous ? "Anonymous Donor" : donor.donorName}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600">₹ {donor.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Supporters */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">RECENT SUPPORTERS</h3>
              <Link href="/transparency" className="text-[11px] text-sky-600 font-medium hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              {recentDonors.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 font-medium">
                  No recent supporters yet.
                </div>
              ) : (
                recentDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-emerald-500" /> 
                      <span className="font-semibold text-slate-800">
                        {donor.anonymous ? "Anonymous Donor" : donor.donorName}
                      </span>
                    </div>
                    <span className="font-bold text-slate-700">₹ {donor.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

