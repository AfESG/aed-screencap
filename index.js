const puppeteer = require('puppeteer');

const ROOT_URL = process.argv[2] || 'https://africanelephantdatabase.org';
const args = [ '--no-sandbox', '--disable-setuid-sandbox' ];
const opts = { args, headless: true };

(async () => {
  const browser = await puppeteer.launch(opts);

  const getPDFPath = (url) => {
    return 'pdfs/' + (new URL(url)).pathname
      .replace('/report/', '')
      .replaceAll('/', '_') + '.pdf';
  };

  const crawl = async (url) => {
    const page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { timeout: 60 });
    const level = await page.$$eval('ol.breadcrumb>li', els => els.length);
    // continent and region
    if (level < 5) {
      const selector = '#tab-section-data-quality-page-0.tab-pane.active>table>tbody>tr>td>a';
      const urls = await page.$$eval(selector, els => els.map(e => e.href));
      const path = getPDFPath(url);
      console.log(`Creating ${path}`)
      await page.pdf({ path });
      await page.close();
      return Array.from(new Set(urls));
    }
    // country
    await page.$$eval('tr>td>a', els => els.forEach(e => e.click())); // expand all input zones
    await page.waitForTimeout(1500); // allow hidden text to fully render
    const path = getPDFPath(url);
    console.log(`Creating ${path}...`)
    await page.pdf({ path });
    await page.close();
  };

  const regionURLs = await crawl(`${ROOT_URL}/report/2023/Africa`);
  const countryURLS = (await Promise.all(regionURLs.map(crawl))).flat();
  await Promise.all(countryURLS.map(crawl));
  await browser.close();
  console.log('Done!');
  process.exit(0);
})();
