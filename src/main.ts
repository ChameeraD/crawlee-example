import { Dataset, PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    async requestHandler({ page }) {
        await page.waitForSelector('.quote');

        const quotesData = await page.$$eval('.quote', (els) => {
            return els.map((el) => {
                const quoteElement = el.querySelector('.text');
                const authorElement = el.querySelector('.author');
                const quote = quoteElement ? quoteElement.textContent : 'No quote found';
                const author = authorElement ? authorElement.textContent : 'No author found';
                return { quote, author };        
            });
        });

        quotesData.forEach(({ quote, author }, i) => {
            console.log(`Quote_${i + 1}: ${quote}\nAuthor: ${author}\n`);
            Dataset.pushData({ Quote: quote, Author: author });
        });
    },
});

await crawler.run(['https://quotes.toscrape.com/']);
