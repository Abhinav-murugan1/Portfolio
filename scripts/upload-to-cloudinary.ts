/**
 * upload-to-cloudinary.ts
 *
 * Uploads images from src/assets/ to Cloudinary.
 * Writes a JSON manifest to cloudinary-manifest.json.
 *
 * Usage: npx tsx scripts/upload-to-cloudinary.ts
 */

import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename_esm = fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname_esm, "../.env") });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ASSETS_DIR = path.resolve(__dirname_esm, "../src/assets");
const MANIFEST_PATH = path.resolve(__dirname_esm, "../cloudinary-manifest.json");

// Only upload image files (skip video/audio)
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function sanitizePublicId(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .trim();
}

interface UploadResult {
  filename: string;
  url: string;
  publicId: string;
  bytes: number;
  width: number;
  height: number;
}

async function uploadFile(filePath: string, filename: string): Promise<UploadResult> {
  const cloudFolder = "nebula-navigator";
  const publicId = sanitizePublicId(filename);

  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cloudFolder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        quality: "auto:good",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            filename,
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error(`Upload failed for ${filename}`));
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
}

function collectImages(dir: string, prefix = ""): { filename: string; filePath: string }[] {
  const results: { filename: string; filePath: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectImages(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push({
          filename: prefix ? `${prefix}/${entry.name}` : entry.name,
          filePath: fullPath,
        });
      }
    }
  }

  return results;
}

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Cloudinary Upload — Nebula Navigator      ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Missing Cloudinary credentials in .env");
    process.exit(1);
  }

  console.log(`☁️  Cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  console.log(`📂 Source: ${ASSETS_DIR}`);
  console.log();

  const files = collectImages(ASSETS_DIR);

  console.log(`📦 Found ${files.length} images to upload\n`);

  const manifest: Record<string, UploadResult> = {};
  let uploaded = 0;
  let failed = 0;

  for (const item of files) {
    try {
      const sizeMB = (fs.statSync(item.filePath).size / (1024 * 1024)).toFixed(2);
      process.stdout.write(`  [${uploaded + failed + 1}/${files.length}] ${item.filename} (${sizeMB}MB)... `);

      const result = await uploadFile(item.filePath, item.filename);
      manifest[item.filename] = result;
      uploaded++;
      console.log("✅");
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌ ${msg}`);

      // Retry once
      try {
        console.log(`    ↻ Retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
        const result = await uploadFile(item.filePath, item.filename);
        manifest[item.filename] = result;
        failed--;
        uploaded++;
        console.log(`    ✅ Retry succeeded`);
      } catch (retryErr: unknown) {
        const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
        console.log(`    ❌ Retry failed: ${retryMsg}`);
      }
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");

  console.log();
  console.log("═══════════════════════════════════════════════");
  console.log(`✅ Uploaded: ${uploaded}/${files.length}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Manifest: ${MANIFEST_PATH}`);
  console.log("═══════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
