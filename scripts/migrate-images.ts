import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

async function uploadBase64IfNeeded(base64Str: string): Promise<string> {
  if (base64Str.startsWith("data:image/")) {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }
    const type = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const ext = type.split("/")[1] || "jpeg";
    const filename = `upload-${Date.now()}.${ext}`;
    const blob = await put(filename, buffer, { access: "public", token: process.env.BLOB_READ_WRITE_TOKEN });
    return blob.url;
  }
  return base64Str;
}

async function main() {
  console.log("Starting image migration to Vercel Blob...");

  // 1. Migrate ProjectImages
  const projectImages = await prisma.projectImage.findMany();
  console.log(`Found ${projectImages.length} project images.`);
  
  let pImageUpdated = 0;
  for (const img of projectImages) {
    if (img.url.startsWith("data:image/")) {
      try {
        console.log(`Migrating ProjectImage ${img.id}...`);
        const blobUrl = await uploadBase64IfNeeded(img.url);
        await prisma.projectImage.update({
          where: { id: img.id },
          data: { url: blobUrl }
        });
        pImageUpdated++;
      } catch (error) {
        console.error(`Failed to migrate ProjectImage ${img.id}:`, error);
      }
    }
  }
  console.log(`Migrated ${pImageUpdated} ProjectImages.`);

  // 2. Migrate Gallery Images
  const galleryImages = await prisma.gallery.findMany();
  console.log(`Found ${galleryImages.length} gallery images.`);

  let gImageUpdated = 0;
  for (const img of galleryImages) {
    if (img.url.startsWith("data:image/")) {
      try {
        console.log(`Migrating Gallery image ${img.id}...`);
        const blobUrl = await uploadBase64IfNeeded(img.url);
        await prisma.gallery.update({
          where: { id: img.id },
          data: { url: blobUrl }
        });
        gImageUpdated++;
      } catch (error) {
        console.error(`Failed to migrate Gallery image ${img.id}:`, error);
      }
    }
  }
  console.log(`Migrated ${gImageUpdated} Gallery images.`);

  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
