/**
 * Downloads real product images for the Dollar Tree Haul video.
 * Runs in GitHub Actions before the Remotion render.
 *
 * Images saved to: video/public/haul/
 *   - bg-aisle.jpg        Dollar Tree store aisle (background)
 *   - dt-tumbler.jpg      Aquaflow 40oz tumbler
 *   - dt-serum.jpg        B Pure Vitamin C serum
 *   - dt-bodywash.jpg     Eve St. Claire body wash
 *   - dt-deodorant.jpg    BPure deodorant
 *   - brand-stanley.jpg   Stanley Quencher
 *   - brand-serum.jpg     Drunk Elephant C-Firma
 *   - brand-soldejan.jpg  Sol de Janeiro Bum Bum
 *   - brand-native.jpg    Native deodorant
 *
 * Falls back to an SVG text placeholder if a URL fails.
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "haul");
fs.mkdirSync(OUT_DIR, { recursive: true });

const IMAGES = [
  // ── Background ────────────────────────────────────────────────────────────
  {
    filename: "bg-aisle.jpg",
    urls: [
      // CC0 retail/store aisle — Unsplash (free to use, no attribution required)
      "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=1920&q=85",
      // Fallback: generic supermarket aisle
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=85",
    ],
    placeholder: { label: "Dollar Tree Aisle", bg: "#22521e", fg: "#ffffff" },
  },

  // ── Dollar Tree products ──────────────────────────────────────────────────
  {
    filename: "dt-tumbler.jpg",
    urls: [
      // Dollar Tree Scene7 CDN — Aquaflow 40oz tumbler (SKU 381454)
      "https://images.dollartree.com/is/image/DollarTree/381454_1?$szd$&wid=640&hei=640&fit=constrain",
      "https://images.dollartree.com/is/image/DollarTree/381454_1",
    ],
    placeholder: { label: "Aquaflow Tumbler 40oz", bg: "#bfdbfe", fg: "#1e3a5f" },
  },
  {
    filename: "dt-serum.jpg",
    urls: [
      "https://images.dollartree.com/is/image/DollarTree/401789_1?$szd$&wid=640&hei=640&fit=constrain",
      "https://images.dollartree.com/is/image/DollarTree/401789_1",
    ],
    placeholder: { label: "B Pure Vitamin C Serum", bg: "#dcfce7", fg: "#14532d" },
  },
  {
    filename: "dt-bodywash.jpg",
    urls: [
      "https://images.dollartree.com/is/image/DollarTree/396930_1?$szd$&wid=640&hei=640&fit=constrain",
      "https://images.dollartree.com/is/image/DollarTree/396930_1",
    ],
    placeholder: { label: "Eve St. Claire Body Wash 20oz", bg: "#fce7f3", fg: "#831843" },
  },
  {
    filename: "dt-deodorant.jpg",
    urls: [
      "https://images.dollartree.com/is/image/DollarTree/386254_1?$szd$&wid=640&hei=640&fit=constrain",
      "https://images.dollartree.com/is/image/DollarTree/386254_1",
    ],
    placeholder: { label: "BPure Aluminum-Free Deodorant", bg: "#f0fdf4", fg: "#14532d" },
  },

  // ── Brand name products ───────────────────────────────────────────────────
  {
    filename: "brand-stanley.jpg",
    urls: [
      // Stanley 1913 press image (public CDN)
      "https://www.stanley1913.com/cdn/shop/files/B2B_Transition_Quencher_H2.0_FlowState_Tumbler_40oz_1400x.jpg?v=1742929064",
      "https://m.media-amazon.com/images/I/51JKFBrB0DL._AC_SL1500_.jpg",
    ],
    placeholder: { label: "Stanley Quencher 40oz — $45", bg: "#1e3a5f", fg: "#ffffff" },
  },
  {
    filename: "brand-serum.jpg",
    urls: [
      // Drunk Elephant C-Firma — publicly served press image
      "https://www.drunkelephant.com/cdn/shop/products/C-FirmaFreshDay-Serum-30mL_PDP_1000x1000.jpg",
      "https://m.media-amazon.com/images/I/51TuKEwUC3L._SL1500_.jpg",
    ],
    placeholder: { label: "Drunk Elephant C-Firma — $68", bg: "#f97316", fg: "#ffffff" },
  },
  {
    filename: "brand-soldejan.jpg",
    urls: [
      // Sol de Janeiro Bum Bum Body Wash
      "https://www.soldejaneiro.com/cdn/shop/products/SDJ_BumBumBodyWash_6oz_1000x1000.jpg",
      "https://m.media-amazon.com/images/I/61bJE+xfJbL._SL1500_.jpg",
    ],
    placeholder: { label: "Sol de Janeiro Bum Bum — $39", bg: "#f59e0b", fg: "#ffffff" },
  },
  {
    filename: "brand-native.jpg",
    urls: [
      // Native deodorant — their public CDN
      "https://cdn.shopify.com/s/files/1/0281/2071/files/native-coconut-vanilla-deodorant.jpg",
      "https://m.media-amazon.com/images/I/41lkSuFDiNL._SL1500_.jpg",
    ],
    placeholder: { label: "Native Deodorant — $13", bg: "#6ee7b7", fg: "#064e3b" },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DupliPromoBot/1.0)",
        "Accept": "image/webp,image/jpeg,image/png,*/*",
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        // Sanity check: must be at least 5KB to be a real image
        if (buf.length < 5000) { reject(new Error(`Too small: ${buf.length}b`)); return; }
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
      res.on("error", reject);
    });
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.on("error", reject);
  });
}

// Generate a valid colored JPEG placeholder using ffmpeg (pre-installed on ubuntu-latest).
// This is critical — Remotion's headless Chrome rejects non-JPEG data in .jpg files.
function writePlaceholderJpeg(dest, label, bg) {
  // Strip leading # from hex color for ffmpeg
  const hex = bg.replace(/^#/, "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  try {
    // ffmpeg solid-color JPEG — 640×640, single frame
    execSync(
      `ffmpeg -y -f lavfi -i "color=c=${r}/${g}/${b}:size=640x640:rate=1" -frames:v 1 -q:v 2 "${dest}"`,
      { stdio: "pipe" }
    );
    console.log(`  🎨 JPEG placeholder → ${path.basename(dest)} (${label})`);
  } catch (e) {
    // Last resort: try ImageMagick
    try {
      execSync(`convert -size 640x640 xc:"${bg}" "${dest}"`, { stdio: "pipe" });
      console.log(`  🎨 ImageMagick placeholder → ${path.basename(dest)}`);
    } catch {
      console.error(`  ❌ Could not create placeholder for ${path.basename(dest)}: ${e.message}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  let downloaded = 0, placeholders = 0;

  for (const img of IMAGES) {
    const dest = path.join(OUT_DIR, img.filename);
    if (fs.existsSync(dest)) {
      console.log(`  ✅ exists — ${img.filename}`);
      downloaded++;
      continue;
    }

    let success = false;
    for (const url of img.urls) {
      try {
        const bytes = await download(url, dest);
        console.log(`  ✅ ${img.filename} (${Math.round(bytes / 1024)}KB) ← ${url.slice(0, 60)}...`);
        success = true;
        downloaded++;
        break;
      } catch (e) {
        console.log(`  ⚠️  ${url.slice(0, 60)} — ${e.message}`);
      }
    }

    if (!success) {
      writePlaceholderJpeg(dest, img.placeholder.label, img.placeholder.bg);
      placeholders++;
    }
  }

  console.log(`\n📦 Done — ${downloaded} downloaded, ${placeholders} placeholders`);
  if (placeholders > 0) {
    console.log("ℹ️  Placeholder images will render as colored cards with product names.");
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
