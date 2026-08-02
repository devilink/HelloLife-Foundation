import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Impact Gallery | Hello Life Foundation",
  description: "View the impact of your donations through photos and videos of our relief operations.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryItems = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <GalleryGrid initialImages={galleryItems} />
    </div>
  );
}
