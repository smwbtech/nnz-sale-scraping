const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function parseFeatures(article, schema) {
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
        let parsedObj = {};


        try {
            await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
            await page.type(nnz.searchInput, article);
            await page.click(nnz.searchSubmit);
            await page.waitForSelector(nnz.searchRes, {timeout: 30000});

            device = await page.evaluate(linkSelector => {
                let element = document.querySelector(linkSelector);
                return {
                    name: element.innerHTML,
                    link: 'http://new.nnz-ipc.ru/' + element.getAttribute('href')
                };
            }, nnz.searchRes);
        }

        catch(err) {
            console.error(err);
        }

        console.log(device);

        try {
            await page.goto(site.link);
            await page.type(site.searchInput, device.name);
            await page.click(site.searchSubmit);
            await page.waitForSelector(site.searchRes);
            await page.click(site.searchRes);
            await page.waitForSelector(site.featureBlock);

            parsedObj = await page.evaluate( selector => {
                let elements = document.querySelectorAll(selector);
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
            }, site.featureName)



        } catch (e) {
            console.log(err);
        }


        console.log(device);
        console.log(parsedObj);
        await browser.close();

        return parsedObj;

    })();
}

module.exports = parseFeatures;
