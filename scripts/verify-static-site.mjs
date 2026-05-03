import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const root = process.cwd();
const htmlFiles = ['index.html', 'admin.html'];
const requiredFiles = [
  '.env.example',
  '.gitignore',
  'README.md',
  'netlify.toml',
  'vercel.json',
  'docs/deployment.md',
  'docs/backend-readiness.md',
  'docs/environment-variables.md',
  'docs/production-checklist.md'
];
const disallowedSecretPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[A-Za-z0-9._-]+/,
  /OPENAI_API_KEY\s*=\s*sk-[A-Za-z0-9_-]+/,
  /DATABASE_URL\s*=\s*postgres(?:ql)?:\/\//
];
const scanFiles = [
  '.env.example',
  'README.md',
  'index.html',
  'admin.html',
  'shared.js',
  'inventory-data.js',
  'app.js',
  'admin.js',
  'styles.css',
  'netlify.toml',
  'vercel.json'
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required production file: ${file}`);
  }
}

for (const htmlFile of htmlFiles) {
  const htmlPath = join(root, htmlFile);
  if (!existsSync(htmlPath)) {
    failures.push(`Missing HTML entrypoint: ${htmlFile}`);
    continue;
  }

  const html = readFileSync(htmlPath, 'utf8');
  const refs = [
    ...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)
  ].map(match => match[1]);

  for (const ref of refs) {
    if (
      ref.startsWith('#') ||
      ref.startsWith('http://') ||
      ref.startsWith('https://') ||
      ref.startsWith('mailto:') ||
      ref.startsWith('tel:')
    ) {
      continue;
    }

    const cleaned = ref.split('#')[0].split('?')[0];
    if (!cleaned) continue;

    const resolved = normalize(join(dirname(htmlPath), cleaned));
    if (!resolved.startsWith(root) || !existsSync(resolved)) {
      failures.push(`${htmlFile} references missing file: ${ref}`);
    }
  }
}

for (const file of scanFiles) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  const contents = readFileSync(path, 'utf8');

  for (const pattern of disallowedSecretPatterns) {
    if (pattern.test(contents)) {
      failures.push(`Potential committed secret pattern in ${file}: ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Static production checks passed.');
