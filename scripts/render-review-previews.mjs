import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const root = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  ['home', '/'],
  ['blueprint', '/mvp-blueprint/'],
  ['development', '/mvp-development/'],
  ['work', '/work/'],
  ['about', '/about/'],
  ['start', '/start/'],
  ['case-cleanr', '/work/cleanr/']
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];
const problems = [];
const result = [];
await mkdir('preview-artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
    for (const [slug, route] of routes) {
      const page = await context.newPage();
      const localErrors=[];
      page.on('pageerror', error => localErrors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') localErrors.push(msg.text()); });
      const response = await page.goto(new URL(route,root).href, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() !== 200) problems.push(route + ' HTTP ' + (response?.status() ?? 'none'));
      const h1 = page.locator('h1');
      if (await h1.count() !== 1 || !await h1.isVisible()) problems.push(route + ' missing visible H1');
      const stats = await page.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        brokenImages: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src'))
      }));
      if (stats.horizontalOverflow) problems.push(route + ' horizontal overflow on '+viewport.name);
      if (stats.brokenImages.length) problems.push(route + ' missing images on '+viewport.name+': '+stats.brokenImages.join(', '));
      if (viewport.name === 'mobile') {
        const toggle=page.locator('[data-menu-toggle]');
        await toggle.click();
        if (await toggle.getAttribute('aria-expanded') !== 'true') problems.push(route + ' mobile menu not opening');
        await page.keyboard.press('Escape');
        if (await toggle.getAttribute('aria-expanded') !== 'false') problems.push(route + ' mobile menu not closing');
      }
      const path='preview-artifacts/'+slug+'-'+viewport.name+'.png';
      await page.screenshot({ path, fullPage:true, animations:'disabled' });
      result.push({ page:route,viewport:viewport.name,screenshot:path,issues:localErrors });
      if (localErrors.length) problems.push(route+' JS/console errors ('+viewport.name+'): '+localErrors.join(' | '));
      await page.close();
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile('preview-artifacts/review.json',JSON.stringify({root,pages:result,problems},null,2));
console.log('Rendered',result.length,'full-page screenshots.');
if (problems.length) { for(const problem of problems) console.error('PREVIEW FAIL:',problem);process.exitCode=1; }
else console.log('Visual smoke checks passed: routes, page errors, image loading, overflow, mobile navigation.');
