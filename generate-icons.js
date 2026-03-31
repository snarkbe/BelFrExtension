// Run with: node generate-icons.js
// Generates simple colored square icons for the extension.

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const sizes = [16, 48, 128];
const dir = path.join(__dirname, "icons");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Belgian flag vertical stripes
  const stripeW = size / 3;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, stripeW, size);
  ctx.fillStyle = "#FDDA24";
  ctx.fillRect(stripeW, 0, stripeW, size);
  ctx.fillStyle = "#EF3340";
  ctx.fillRect(stripeW * 2, 0, stripeW, size);

  // "FR" text overlay
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${Math.floor(size * 0.45)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.strokeText("FR", size / 2, size / 2);
  ctx.fillText("FR", size / 2, size / 2);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(dir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
}
