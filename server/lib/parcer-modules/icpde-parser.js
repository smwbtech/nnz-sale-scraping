const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');


/*
*   @desc - модуль парсинго свойств товара с сайта icp-deutschland.de
*   @articles: Array - массив строк, содержащий объект товара:
        {
            @name: String - строка с наименованием товара
            @article: String - строка с артикулом товара на сайте nnz-ipc.ru
        }
    @schema: Object - объект схемы парсинга, содержащий ключ значение, следующего вида:
        {
            'Название характеристики на сайтк nnz': 'Название характеристики на сайте ipc-deutschland.de'
        }
    @return:Array - массив, в котором содержатся объекты товаров с найденными характеристиками
*
*/
function getFeatures(articles, schema) {

    //NOTE: убрать, сделано для теста
    // var articles = articles.slice(0, 15);

    return ( async () => {

        const icpde = config.icpde;
        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();
        let pattern = schema.pattern;

        await page.goto(icpde.url, {timeout: 30000});
        await page.waitForSelector(icpde.changeLang);
        await page.click(icpde.changeLang);
        await page.waitForSelector(icpde.searchInput);

        for(let i = 0; i < articles.length; i++) {

            //Заходим на страницу сайта icpde
            try {
                await page.goto(icpde.url, {timeout: 30000});
                await page.waitForSelector(icpde.searchInput);
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }

            //Вводим в поле поиска название товара, ищем его и переходим на карточку товара
            try {
                await page.focus(icpde.searchInput);
                await page.type(icpde.searchInput, articles[i].name);
                await page.keyboard.down('Enter');
                await page.waitForSelector(icpde.searchResultLink);
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }

            //Вводим в поле поиска название товара и ищем его
            try {
                await page.focus(icpde.searchInput);
                await page.type(icpde.searchInput, articles[i].name);
                await page.keyboard.down('Enter');
                await page.waitForSelector(icpde.searchResultLink);
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }

            //Переходим на карточку товара и получаем характеристики
            try {
                await page.click(icpde.searchResultLink);
                await page.waitForSelector(icpde.featerNameElement)
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }

            try {
                articles[i].data = await page.evaluate( (selector, patternObj) => {

                    let elements = document.querySelectorAll(selector);
                    let pattern = patternObj;
                    let res = {};
                    for(let prop in pattern) {
                        let regExp = new RegExp( pattern[prop], 'i');
                        for(let i = 0; i < elements.length; i++) {
                            if(regExp.test(elements[i].innerText)) {
                                var currentElem = elements[i].parentNode.nextElementSibling;
								var content = '';
								while(currentElem !== null && currentElem.tagName == 'DD') {
									content += currentElem.innerHTML + '<br>';
									currentElem = currentElem.nextElementSibling;
								}
                                res[prop] = content;
                            }
                        }
                    }
                    return res;

                }, icpde.featerNameElement, pattern);
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }

        }

        await browser.close();
        return articles;

    })();


}

module.exports = getFeatures;
