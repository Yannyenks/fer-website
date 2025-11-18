import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve(process.cwd(), 'public', 'assets');
const outFile = path.resolve(assetsDir, 'manifest.json');

function generate() {
  if (!fs.existsSync(assetsDir)) {
    console.warn('public/assets does not exist — creating folder.');
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const files = fs.readdirSync(assetsDir)
    .filter(f => f !== 'manifest.json' && !f.startsWith('.'))
    .map(f => `/assets/${f}`);

  fs.writeFileSync(outFile, JSON.stringify(files, null, 2), 'utf8');
  console.log('Wrote manifest with', files.length, 'assets to', outFile);
}

generate();
