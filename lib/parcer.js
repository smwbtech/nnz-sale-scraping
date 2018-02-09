const fs = require('fs');
const xlsx2json = require('xlsx2json');
const puppeteer = require('puppeteer');


module.exports = {
    parseFile(path) {
        return xlsx2json(path,
            {
                dataStartingRow: 3,
                mapping: {
                    '_id': 'A'
                }
            }
        )
        .then( (res) => {
            return res;
        });
    },

    getLinks(jsonList) {
        let res = jsonList[0];
        return (async () => {

            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            const linkSelector = 'div.search-results_title > a';
            let linkArr = [];
            
            for(let i = 0; i < res.length; i++) {
                try {
                    console.log(res[i]._id.slice(4));
                    await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
                    await page.type('#search_form', res[i]._id.slice(4));
                    await page.click('.search-block__form_btn');
                    await page.waitForSelector(linkSelector, {timeout: 60000});

                    let link = await page.evaluate(linkSelector => {
                        let href = document.querySelector(linkSelector).getAttribute('href');
                        return href;
                    }, linkSelector);

                    res[i].link = `http://new.nnz-ipc.ru/${link}`;

                    console.log(link);

                }
                catch(err) {
                    console.error(err);
                    continue;
                }
            }

            await browser.close();

            return res;

        })()
    }
}
