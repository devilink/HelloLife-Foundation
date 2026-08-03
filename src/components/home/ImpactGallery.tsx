"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import Image from "next/image";

export default function ImpactGallery({ galleryImages = [] }: { galleryImages?: any[] }) {
  const imagesToDisplay = galleryImages.length > 0 
    ? galleryImages 
    : [
        { id: '1', url: "/gallery/1.jpg", title: "Food Distribution", category: "Food & Supplies" },
        { id: '2', url: "/gallery/2.jpg", title: "Medical Relief Camp", category: "Healthcare" },
        { id: '3', url: "/gallery/3.jpg", title: "Shelter Rebuilding", category: "Relief Work" },
        { id: '4', url: "/gallery/4.jpg", title: "Ground Rescue Operations", category: "Emergency Response" },
      ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Our Works</h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            See how we make a difference on the ground.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {imagesToDisplay.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-100 p-2 flex items-center justify-center">
                <Image 
                  src={img.url || img.src} 
                  alt={img.title || "Impact Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 leading-snug">{img.title}</h3>
                  {img.category && (
                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed font-normal">
                      {img.category}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

