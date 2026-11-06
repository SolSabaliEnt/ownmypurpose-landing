import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';

const root = process.cwd();
const pages = [
  'index.html',
  'business-systems/index.html',
  'assessment/index.html',
  'mvp-blueprint/index.html',
  'mvp-development/index.html',
  'work/index.html',
  'work/simple-paws/index.html',
  'work/cleanr/index.html',
  'work/kinex-core/index.html',
  'about/index.html',
  'start/index.html'
];

let failures = 0;
function check(ok, message) {
  if (!ok) { console.error('FAIL:', message); failures++; }
  else console.log('PASS:', message);
}

for (const file of pages) {
  const path = join(root, file);
  check(existsSync(path), file + ' exists');
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  check((html.match(/<h1\b/g) || []).length === 1, file + ' has one H1');
  check(/<title>[^<]+<\/title>/.test(html), file + ' has a title');
  check(/<meta name="description" content="[^"]+"/.test(html), file + ' has description');
  check(/<link rel="canonical" href="https:\/\/ownmypurpose\.io\//.test(html), file + ' has canonical');
  check(html.includes('class="skip"') && html.includes('id="main"'), file + ' skip link works');
  check(html.includes('aria-label="Main navigation"') && html.includes('Business Systems') && html.includes('Software Development') && html.includes('Contact'), file + ' uses unified marketing navigation');
  check(!/\bpilot\b/i.test(html) && !/\$750|\$1,250/.test(html), file + ' avoids pilot and upfront fee claims');
  const pageTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const socialTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  check(pageTitle === socialTitle, file + ' social title matches page title');
  check(/© 2026 <a href="https:\/\/williamsiiifamily\.com\/" target="_blank" rel="noopener noreferrer">WILLIAMS III FAMILY ENTERPRISES LLC<\/a>\. ALL RIGHTS RESERVED\./.test(html), file + ' links company name in legal footer');
  check(html.includes('30 N GOULD ST · STE R · SHERIDAN, WY 82801'), file + ' preserves company address');
  if (file === 'index.html' || file === 'about/index.html') {
    check(html.includes('src="/assets/rwiii%20headshot%20for%20williams%20family%20enterprises.png"'), file + ' displays the new founder headshot');
    check(!html.includes('Rob Cartoon 1024x1024.png'), file + ' no longer displays the cartoon');
  }
  check(!html.includes('FAMILY HOLDINGS · FAMILY OFFICE'), file + ' omits the family-holdings descriptor');
  const links = [...html.matchAll(/\b(?:href|src)="(\/[^"#?]*)[^"]*"/g)].map(x => x[1]);
  for (const href of links) {
    const decodedHref = decodeURIComponent(href);
    const dest = decodedHref === '/' ? 'index.html' : extname(decodedHref) ? decodedHref.slice(1) : join(decodedHref.slice(1), 'index.html');
    check(existsSync(join(root, dest)), file + ' internal link ' + href);
  }
  check(!/project_brief_submitted|booking_confirmed|blueprint_purchase_completed/.test(html), file + ' does not claim unverified conversions');
}
const css = readFileSync(join(root, 'assets/site.css'), 'utf8');
const js = readFileSync(join(root, 'assets/site.js'), 'utf8');
check(css.includes('prefers-reduced-motion'), 'Reduced motion supported');
check(css.includes('@media(max-width:760px)'), 'Mobile breakpoint present');
check(js.includes('aria-expanded'), 'Navigation updates disclosure state');
check(readFileSync(join(root, 'start/index.html'), 'utf8').includes('www.formulateforms.com/f/own-my-purpose/business-systems-fit'), 'Business intake uses Formulate');
check(readFileSync(join(root, 'start/index.html'), 'utf8').includes('www.formulateforms.com/f/own-my-purpose/discovery-call'), 'Product intake uses Formulate');
check(readFileSync(join(root, 'start/index.html'), 'utf8').includes('id="business-inquiry"') && readFileSync(join(root, 'start/index.html'), 'utf8').includes('id="product-inquiry"'), 'Contact page provides two distinct inquiry destinations');
check(existsSync(join(root, 'CNAME')), 'Custom domain file preserved');
check(existsSync(join(root, 'images/ownmypurpose-favicon.png')), 'Favicon preserved');
if (failures) process.exitCode = 1;
else console.log('\nStatic validation passed for ' + pages.length + ' pages.');
