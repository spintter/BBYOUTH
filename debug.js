const { chromium } = require('@playwright/test');

async function captureConsoleLogs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    console.log(`[Console ${msg.type()}]: ${msg.text()}`);
  });

  // Listen to errors
  page.on('pageerror', err => {
    console.error(`[Page Error]: ${err.message}`);
  });

  try {
    // Try port 3001 first
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Wait 5 seconds to capture logs
  } catch (error) {
    console.log('Error on port 3001:', error);
    try {
      // Try port 3000 if 3001 fails
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000); // Wait 5 seconds to capture logs
    } catch (error) {
      console.log('Error on port 3000:', error);
    }
  }

  await browser.close();
}

captureConsoleLogs().catch(console.error); 