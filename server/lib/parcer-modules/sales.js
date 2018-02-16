const puppeteer = require('puppeteer');
const config = require('./../config');



//В цикле обходим json и делаем запросы на сайте, получая наименование товара и ссылку на него

function getLinks(jsonList, progressbar) {
    let res = jsonList[0];
    console.log(res);
    return (async () => {

        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();
        const linkSelector = 'div.search-results_title > a';
        let bar = progressbar;

        for(let i = 0; i < res.length; i++) {
            try {
                // console.log(res[i]._id.slice(4));
                await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
                await page.waitForSelector('#search_form');
                await page.type('#search_form', res[i]['Артикул'].slice(4));
                await page.click('.search-block__form_btn');
                await page.waitForSelector(linkSelector, {timeout: 30000});

                let link = await page.evaluate(linkSelector => {
                    let element = document.querySelector(linkSelector);
                    return {
                        value: element.innerHTML,
                        hyperlink: 'http://new.nnz-ipc.ru/' + element.getAttribute('href')
                    };
                }, linkSelector);

                res[i]['Код вендора'] = link;
                res[i]['Ссылка на сайт'] = {
                    value: 'Перейти в каталог',
                    hyperlink: link.hyperlink
                }
                bar.tick();

            }
            catch(err) {
                console.error(err);
                res[i]['Ссылка на сайт'] = 'Данный товар не имеет карточки товара на сайте. Обратитесь к менеджеру'
                bar.tick();
                continue;
            }
        }

        await browser.close();
        delete global.bar;
        return res;

    })()
}

module.exports = getLinks;
