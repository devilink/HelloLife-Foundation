import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

import { getGalleryData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impact Gallery | Hello Life Foundation",
  description: "View the impact of your donations through photos and videos of our relief operations.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const galleryItems = await getGalleryData();

  return (
    <div className="min-h-screen bg-background">
      <GalleryGrid initialImages={galleryItems} />
    </div>
  );
}
