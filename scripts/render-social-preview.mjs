import { chromium } from "playwright";
import fs from "node:fs";

const base = "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });

const source = await context.newPage();
await source.goto(base + "/index.html", { waitUntil: "networkidle" });
await source.addStyleTag({ content: `
  .reveal{opacity:1!important;transform:none!important}
  .phone-link:nth-child(n){transform:none!important}
  .phone-meta{display:none!important}
  .phone-rail{margin-top:0!important}
` });
const rail = source.locator(".phone-rail");
await rail.scrollIntoViewIfNeeded();
await source.waitForTimeout(500);
await rail.screenshot({ path: "images/_phones.png" });

const card = await context.newPage();
await card.setViewportSize({ width: 1200, height: 630 });
await card.goto(base + "/social-card.html", { waitUntil: "networkidle" });
await card.waitForFunction(() => {
  const img = document.querySelector(".visual img");
  return img && img.complete && img.naturalWidth > 0;
});
await card.screenshot({ path: "images/ownmypurpose-social-preview.png", fullPage: false });

if (fs.existsSync("images/_phones.png")) fs.unlinkSync("images/_phones.png");
await browser.close();