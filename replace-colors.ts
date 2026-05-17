import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (filepath: string) => void) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filep = path.join(dir, file);
    const stat = fs.statSync(filep);
    if (stat && stat.isDirectory()) walk(filep, callback);
    else callback(filep);
  });
}

walk('./src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let hasChanges = false;
    
    const replacements = [
      { from: /text-blue-/g, to: 'text-green-' },
      { from: /bg-blue-/g, to: 'bg-green-' },
      { from: /shadow-blue-/g, to: 'shadow-green-' },
      { from: /ring-blue-/g, to: 'ring-green-' },
      { from: /border-blue-/g, to: 'border-green-' },
      { from: /apple-blue/g, to: 'nutri-green' },
    ];

    replacements.forEach(r => {
      if (r.from.test(content)) {
        content = content.replace(r.from, r.to);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filepath, content);
      console.log(`Updated ${filepath}`);
    }
  }
});
