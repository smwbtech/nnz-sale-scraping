const fs = require('fs');
const xlsx2json = require('xlsx2json');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');


module.exports = {

    //Переводим xlsx в json
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

    //В цикле обходим json и делаем запросы на сайте, получая наименование товара и ссылку на него
    getLinks(jsonList) {
        let res = jsonList[0];
        return (async () => {

            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            const linkSelector = 'div.search-results_title > a';
            let bar = new ProgressBar('  Прогресс: [:bar] :percent', {
                complete: '|',
                incomplete: '.',
                width: 20,
                total: res.length
            });
            let linkArr = [];

            for(let i = 0; i < res.length; i++) {
                try {
                    // console.log(res[i]._id.slice(4));
                    await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
                    await page.type('#search_form', res[i]._id.slice(4));
                    await page.click('.search-block__form_btn');
                    await page.waitForSelector(linkSelector, {timeout: 60000});

                    let link = await page.evaluate(linkSelector => {
                        let element = document.querySelector(linkSelector);
                        return {
                            value: element.innerHTML,
                            hyperlink: 'http://new.nnz-ipc.ru/' + element.getAttribute('href')
                        };
                    }, linkSelector);

                    res[i].link = link;
                    bar.tick();

                    // console.log(link);

                }
                catch(err) {
                    console.error(err);
                    res[i].link = 'Данный товар не имеет карточки товара на сайте. Обратитесь к менеджеру'
                    bar.tick();
                    continue;
                }
            }

            await browser.close();

            return res;

        })()
    }
}
