"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ImpactGallery({ galleryImages = [] }: { galleryImages?: any[] }) {
  // Use DB images if available, otherwise fallback to placeholder array if you prefer, or just show nothing if empty.
  const imagesToDisplay = galleryImages.length > 0 
    ? galleryImages 
    : [
        { id: '1', url: "/gallery/1.jpg", title: "Food Distribution" },
        { id: '2', url: "/gallery/2.jpg", title: "Medical Camp" },
        { id: '3', url: "/gallery/3.jpg", title: "Shelter Rebuilding" },
        { id: '4', url: "/gallery/4.jpg", title: "Rescue Operations" },
      ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground">Impact in Action</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Witness the real-world impact of your contributions through our on-ground operations.
          </p>
        </div>
      </div>

      {/* Full width gallery with scrolling or grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {imagesToDisplay.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 4) * 0.1, duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/5 break-inside-avoid"
            >
              <img 
                src={img.url || img.src} 
                alt={img.title || "Impact Image"}
                className="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ backgroundColor: `var(--chart-${(idx % 5) + 1})` }}
              />
              
              {/* Subtle hover overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-lg font-bold tracking-wide">{img.title}</h3>
                  {img.category && <p className="text-emerald-400 text-sm font-medium mt-1">{img.category}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
