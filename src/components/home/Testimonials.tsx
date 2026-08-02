"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Monthly Donor",
    quote: "The transparency dashboard is what convinced me to become a regular donor. I can see exactly where every rupee goes, which builds immense trust.",
    avatar: "S"
  },
  {
    id: 2,
    name: "Dr. Anil Kumar",
    role: "Volunteer Doctor",
    quote: "Working on the ground with Hello Life Foundation showed me their incredible efficiency. Supplies reach the affected areas faster than any other organization I've worked with.",
    avatar: "A"
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Community Leader",
    quote: "When our village was flooded, they were the first to arrive with clean water and medical kits. They truly rebuild lives and restore hope.",
    avatar: "P"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground">Voices of Trust</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from the people who power our mission and those we've helped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-card p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10 rotate-180" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">{testimonial.name}</h4>
                  <p className="text-sm font-medium text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed relative z-10 italic">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
