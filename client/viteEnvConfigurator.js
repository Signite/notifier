import fs from 'fs';

if (process.env.BASE_URL) {
    const fileText = fs.readFileSync('./vite.config.ts', 'utf8');
    fs.writeFileSync('./vite.config.ts',fileText.replace('"/"', `"${process.env.BASE_URL}"`));
}
