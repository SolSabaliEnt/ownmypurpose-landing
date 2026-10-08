import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';

const root = process.cwd();
const pages = [
  'index.html',
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
  check(html.includes('Discuss My App Idea'), file + ' keeps lead CTA');
  const links = [...html.matchAll(/\b(?:href|src)="(\/[^"#?]*)[^"]*"/g)].map(x => x[1]);
  for (const href of links) {
    const dest = href === '/' ? 'index.html' : extname(href) ? href.slice(1) : join(href.slice(1), 'index.html');
    check(existsSync(join(root, dest)), file + ' internal link ' + href);
  }
  check(!/project_brief_submitted|booking_confirmed|blueprint_purchase_completed/.test(html), file + ' does not claim unverified conversions');
}
const css = readFileSync(join(root, 'assets/site.css'), 'utf8');
const js = readFileSync(join(root, 'assets/site.js'), 'utf8');
check(css.includes('prefers-reduced-motion'), 'Reduced motion supported');
check(css.includes('@media(max-width:760px)'), 'Mobile breakpoint present');
check(js.includes('aria-expanded'), 'Navigation updates disclosure state');
check(existsSync(join(root, 'CNAME')), 'Custom domain file preserved');
check(existsSync(join(root, 'images/ownmypurpose-favicon.png')), 'Favicon preserved');
if (failures) process.exitCode = 1;
else console.log('\nStatic validation passed for ' + pages.length + ' pages.');
