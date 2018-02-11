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

            device.features = await page.evaluate(selector => {
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

        } catch (e) {

        }



        await browser.close();

        return device;

    })();
}

module.exports = getFeatures;
