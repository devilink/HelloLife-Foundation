import { prisma } from "@/lib/prisma";
import GalleryClientHeader from "./GalleryClientHeader";
import DeleteAction from "@/components/admin/DeleteAction";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <GalleryClientHeader />
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap w-24">Image</th>
                <th className="p-4 font-medium whitespace-nowrap">Title</th>
                <th className="p-4 font-medium whitespace-nowrap">Category</th>
                <th className="p-4 font-medium whitespace-nowrap">Linked Project</th>
                <th className="p-4 font-medium whitespace-nowrap">Date Uploaded</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {images.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No gallery images uploaded yet.
                  </td>
                </tr>
              ) : (
                images.map((img) => (
                  <tr key={img.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                        <Image src={img.url} alt={img.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{img.title}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                        {img.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {(img as any).projectId ? "Yes" : "General"}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {img.createdAt.toISOString().split("T")[0]}
                    </td>
                    <td className="p-4 text-right">
                      <DeleteAction id={img.id} entity="galleryImage" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
