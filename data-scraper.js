import { JSDOM } from "jsdom";
import vanillaPuppeteer from "puppeteer";
import { addExtra } from "puppeteer-extra"; // TODO: maybe change this after this issue is resolved: https://github.com/berstend/puppeteer-extra/issues/748
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import extractDailyData from "./data-extracter.js";


async function scrapeAll() {
    let pageNum = 1;
    const maxNoArticlePages = 3;
    let consecutiveNoArticlePages = 0;
    let articleFound = false;
    const allArticles = [];
    const puppeteer = addExtra(vanillaPuppeteer);
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let errored = false;

    do {
        const response = await page.goto(`https://www.mil.gov.ua/en/news/?page=${pageNum}`, {waitUntil: 'domcontentloaded'});
        if( response?.status() === 404 ) {
            errored = true;
            break;
        }
        articleFound = false;
        console.log( "Loaded page " + pageNum );
        const htmlString = await page.content();
        const dom = new JSDOM( htmlString );
        const articles = dom.window.document.getElementById( "aticle-content")?.querySelectorAll("h4");
        articles?.forEach( article => {
            const { textContent } = article;
            if( textContent?.includes( "The total combat losses of the enemy" ) ) {
                if( article?.nextElementSibling?.textContent) {
                    allArticles.push( article?.nextElementSibling?.textContent);
                    articleFound = true;
                    console.log("Articles found: " + allArticles.length);
                }
            }
        })
        if( !articleFound ) {
            consecutiveNoArticlePages++;
        } else {
            consecutiveNoArticlePages = 0;
        }

        if( consecutiveNoArticlePages === maxNoArticlePages ) {
            break;
        }
        pageNum++;
    } while ( !errored );
  
    allArticles.forEach( article => { 
        //console.log( "Article title: " + article.title.textContent);
        console.log( "Article content: " + article);
        const data = extractDailyData(article);
        console.log( data );
    });
    await browser.close();
}

async function scrapeLatest() {

}

export {
    scrapeAll,
    scrapeLatest
}