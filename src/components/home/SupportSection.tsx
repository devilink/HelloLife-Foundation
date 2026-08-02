"use client";

import { motion } from "framer-motion";
import { Heart, CalendarClock } from "lucide-react";
import Link from "next/link";

export default function SupportSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground">Ways to Support</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Your contributions directly fund our relief efforts. Choose a support method that works best for you.
          </p>
        </div>

        <div className="bg-card rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            
            {/* LEFT: One-Time Support */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 md:p-16 flex flex-col items-center text-center hover:bg-muted/30 transition-colors"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">One-Time Support</h3>
              <p className="text-muted-foreground text-lg mb-10 max-w-sm">
                Make an immediate impact. Your single donation goes a long way in providing urgent relief supplies.
              </p>
              <div className="w-full max-w-sm space-y-4 mt-auto">

                <Link href="/donate">
                  <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    Donate Now
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT: Monthly Support */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 md:p-16 flex flex-col items-center text-center hover:bg-muted/30 transition-colors"
            >
              <div className="w-20 h-20 bg-secondary/10 rounded-[2rem] flex items-center justify-center mb-8">
                <CalendarClock className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Monthly Support</h3>
              <p className="text-muted-foreground text-lg mb-10 max-w-sm">
                Join our monthly giving program to ensure sustainable and continuous humanitarian support.
              </p>
              <div className="w-full max-w-sm space-y-4 mt-auto">

                <Link href="/donate?type=monthly">
                  <button className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-secondary/20">
                    Give Monthly
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
