const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function parseFeatures(articles, schema) {

    var articles = articles.slice(0, 15);

    return (async () => {

        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();

        //Основные селекторы nnz
        const nnz = {
            searchInput: '#search_form',
            searchSubmit: '.search-block__form_btn',
            searchRes: 'div.search-results_title > a',
            featureBlock: '.sheet-block',
            featureName: '.sheet-block td:first-child'
        };

        const site = {
            link: 'https://ipc2u.ru/',
            searchInput: '#title-search-input',
            searchSubmit: '#title-search > form > button.hidefixed',
            searchRes: '.list-search-results .title > a',
            featureBlock: '.specification',
            featureName: '.specification dt'

        };

        let pattern = schema.pattern;
        let device = null;
        let parsedObj = null;

        for(let i = 0; i < articles.length; i++) {

            //NOTE: Этот блок актуален, если у нас есть только артикулы

            // try {
            //     await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
            //     await page.type(nnz.searchInput, articles[i]);
            //     await page.click(nnz.searchSubmit);
            //     await page.waitForSelector(nnz.searchRes, {timeout: 30000});
            //
            //     device = await page.evaluate(linkSelector => {
            //         let element = document.querySelector(linkSelector);
            //         return {
            //             name: element.innerHTML,
            //             link: 'http://new.nnz-ipc.ru/' + element.getAttribute('href')
            //         };
            //     }, nnz.searchRes);
            // }
            //
            // catch(err) {
            //     console.error(err);
            //     continue;
            // }

            try {
                await page.goto(site.link);
                await page.type(site.searchInput, articles[i].name);
                await page.focus(site.searchInput);
                await page.keyboard.down('Enter');
                await page.waitForSelector(site.searchRes, {timeout: 15000});
            }
            catch(err) {
                console.log(err);
                articles[i].data = null
                continue;
            }
            try {

                await page.click(site.searchRes);
                await page.waitForSelector(site.featureBlock);

                articles[i].data = await page.evaluate( (selector, patternObj) => {
                    let elements = document.querySelectorAll(selector);
                    let pattern = patternObj;
                    let res = {};
                    for(let prop in pattern) {
                        let regExp = new RegExp( pattern[prop], 'i');
                        for(let i = 0; i < elements.length; i++) {
                            if(regExp.test(elements[i].innerText)) {
                                res[prop] = elements[i].nextElementSibling.innerText;
                            }
                        }
                    }
                    return res;
                }, site.featureName, pattern)

            }

            catch (err) {
                articles[i].data = null
                console.log(err);
                continue;
            }
        }

        console.log(parsedObj);
        await browser.close();

        return articles;

    })();
}

module.exports = parseFeatures;
