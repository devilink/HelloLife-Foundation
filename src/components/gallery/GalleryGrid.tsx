"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const categories = ["All", "Food Distribution", "Medical Camps", "Rescue Operations", "Shelter", "Volunteer Activities"];

type GalleryImage = {
  id: string;
  url: string;
  category: string;
  title: string;
};

export default function GalleryGrid({ initialImages }: { initialImages: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = initialImages.filter(
    (img) => activeCategory === "All" || img.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Impact Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See the direct impact of your donations and the hard work of our volunteers on the ground.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              activeCategory === category
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "bg-card border border-border text-foreground hover:bg-muted"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredImages.map((image) => (
            <motion.div
              layout
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-border shadow-sm"
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-primary-foreground/80 text-xs font-bold uppercase tracking-wider mb-1">{image.category}</span>
                <h3 className="text-white text-xl font-bold">{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
