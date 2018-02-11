const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

function getFeatures(article) {
    return (async () => {

        const browser = await puppeteer.launch({headless: false});
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

        let device = null;


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


            await page.click(nnz.searchRes);
            await page.waitForSelector(nnz.featureBlock);

            device.nnzFeatures = await page.evaluate(selector => {
                let elements = document.querySelectorAll(selector);
                let res = [];
                for(let i = 0; i < elements.length; i++) {
                    if(!elements[i].classList.contains('group-name')) res.push(elements[i].innerText);
                }
                return res;
            }, nnz.featureName);
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

            device.siteFeatures = await page.evaluate( selector => {
                let elements = document.querySelectorAll(selector);
                let res = [];
                for(let i = 0; i < elements.length; i++) {
                    res.push(elements[i].innerText);
                }
                return res;
            }, site.featureName)



        } catch (e) {
            console.log(err);
        }


        console.log(device);
        await browser.close();

        return device;

    })();
}

module.exports = getFeatures;
