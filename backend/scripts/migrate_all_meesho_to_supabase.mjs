import { PrismaClient } from '@prisma/client';
import { uploadFileToSupabase, IMAGE_BUCKET } from '../src/services/supabaseStorage.service.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:4d64f6803727733d55ab7804445a654a@supabase.hrgroupco.in:5432/postgres?connection_limit=3'
    }
  }
});

async function migrateAllMeeshoImages() {
  console.log('🚀 Starting full migration of all meesho.com images to Supabase storage...');
  
  const allProducts = await prisma.product.findMany({
    select: { id: true, title: true, images: true }
  });

  const meeshoProducts = allProducts.filter(p =>
    Array.isArray(p.images) && p.images.some(img => typeof img === 'string' && img.includes('meesho.com'))
  );

  console.log(`Found ${meeshoProducts.length} products with meesho.com images to migrate.`);

  let successCount = 0;
  let failCount = 0;

  // Process in small parallel chunks of 4
  const CHUNK_SIZE = 4;
  for (let i = 0; i < meeshoProducts.length; i += CHUNK_SIZE) {
    const chunk = meeshoProducts.slice(i, i + CHUNK_SIZE);

    await Promise.all(
      chunk.map(async (prod) => {
        try {
          const newImages = [];
          for (const rawImg of prod.images) {
            if (typeof rawImg === 'string' && rawImg.includes('meesho.com')) {
              const res = await fetch(rawImg, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                signal: AbortSignal.timeout(10000)
              });

              if (!res.ok) {
                console.warn(`[Skip] HTTP ${res.status} for ${rawImg}`);
                newImages.push(rawImg);
                continue;
              }

              const buffer = Buffer.from(await res.arrayBuffer());
              const cleanSlug = (prod.title || 'prod').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25);
              const filename = `prod_${prod.id.slice(0, 8)}_${cleanSlug}.jpg`;

              const uploadRes = await uploadFileToSupabase({
                buffer,
                originalFilename: filename,
                mimeType: 'image/jpeg',
                folder: 'products',
                bucket: IMAGE_BUCKET
              });

              newImages.push(uploadRes.url);
            } else {
              newImages.push(rawImg);
            }
          }

          await prisma.product.update({
            where: { id: prod.id },
            data: { images: newImages }
          });

          successCount++;
        } catch (err) {
          failCount++;
          console.error(`[Error] product ${prod.id}:`, err?.message || err);
        }
      })
    );

    if ((i + CHUNK_SIZE) % 20 === 0 || i + CHUNK_SIZE >= meeshoProducts.length) {
      console.log(`Progress: ${Math.min(i + CHUNK_SIZE, meeshoProducts.length)} / ${meeshoProducts.length} done (Success: ${successCount}, Fail: ${failCount})`);
    }
  }

  console.log(`\n🎉 Full migration complete! Successfully migrated ${successCount} products to Supabase storage. (Failures: ${failCount})`);
}

migrateAllMeeshoImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
