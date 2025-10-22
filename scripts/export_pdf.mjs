#!/usr/bin/env node
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

async function main() {
  const [, , inArg = 'assets/cv.html', outArg = 'assets/cv.pdf'] = process.argv;
  const inPath = path.resolve(inArg);
  const outPath = path.resolve(outArg);

  if (!fs.existsSync(inPath)) {
    console.error(`Input HTML not found: ${inPath}`);
    process.exit(1);
  }

  const url = pathToFileURL(inPath).href;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    // Ensure print styles apply
    await page.emulateMediaType('print');
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '18mm', right: '16mm', bottom: '18mm', left: '16mm' },
      preferCSSPageSize: true,
    });

    console.log(`Wrote ${outPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

