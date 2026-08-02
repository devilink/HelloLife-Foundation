import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Impact Gallery | Hello Life Foundation",
  description: "View the impact of your donations through photos and videos of our relief operations.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let galleryItems = [];
  try {
    galleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <GalleryGrid initialImages={galleryItems} />
    </div>
  );
}
