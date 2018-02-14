const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function getFeatures(article) {
    return (async () => {

        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();

        let resultObj = {
            success: true,
            data: null
        }

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

        //Входим на сайт nnz-ipc.ru
        try {
            await page.goto('http://new.nnz-ipc.ru/', {timeout: 30000});
            await page.type(nnz.searchInput, article);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Пробемы соединения с сайтом nnz-ipc.ru';
            return resultObj;
        }

        //Ищем товар на nnz
        try {
            await page.click(nnz.searchSubmit);
            await page.waitForSelector(nnz.searchRes, {timeout: 30000});
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Товар не найден на сайте nnz-ipc.ru';
            return resultObj;
        }

        //Получаем характеристики из соответствующей вкладки
        try {

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
            resultObj.success = false;
            resultObj.data = 'Проблема с доступом к характеристикам на сайте nnz-ipc.ru';
            return resultObj;
        }

        console.log(device);


        //Идем на сайт поставщика
        try {
            await page.goto(site.link);
            await page.waitForSelector(site.searchInput);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Проблема с доступом к выбранному сайту';
            return resultObj;
        }

        //Пробуем найти товар на сайтк поставщика
        try {
            await page.type(site.searchInput, device.name);
            await page.focus(site.searchInput);
            await page.keyboard.down('Enter');
            await page.waitForSelector(site.searchRes, {timeout: 15000});
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Товар не найден на выбранном сайте';
            return resultObj;
        }

        //Берем названия характеристик с сайта поставщика
        try {

            await page.click(site.searchRes);
            await page.waitForSelector(site.featureBlock);

            device.siteFeatures = await page.evaluate( selector => {
                let elements = document.querySelectorAll(selector);
                let res = [];
                for(let i = 0; i < elements.length; i++) {
                    res.push(elements[i].innerText);
                }
                return res;
            }, site.featureName);

        }

        catch (e) {
            resultObj.success = false;
            resultObj.data = 'Проблема с доступок к карточке товара на выбранном сайте';
            return resultObj;
        }


        resultObj.data = device;
        await browser.close();

        return resultObj;

    })();
}

module.exports = getFeatures;
