import { scrapeAll } from "./data-scraper.js";

run()
    .then(() => {
        console.log("finished");
    });

async function run() {
    console.log( "here" );
    await scrapeAll();
}