const fs = require('fs');
let c = fs.readFileSync('src/payload.config.ts', 'utf8');
c = c.replace(/from '\.\/(collections|globals|endpoints)\/([^']+)'/g, (match, folder, file) => {
  if (file.endsWith('.ts')) return match;
  return `from './${folder}/${file}.ts'`;
});
fs.writeFileSync('src/payload.config.ts', c);
