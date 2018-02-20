const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function getFeatures(id) {
    return (async () => {

        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();

        let resultObj = {
            success: true,
            data: null
        }

        //Основные селекторы nnz
        const nnz = config.nnz;
        const site = config.ipc2u;

        let device = null;

        //Входим на сайт nnz-ipc.ru
        try {
            await page.goto(nnz.url, {timeout: 30000});
            await page.waitForSelector(nnz.searchInput);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Пробемы соединения с сайтом nnz-ipc.ru';
            await browser.close();
            return resultObj;
        }

        //Ищем товар на nnz
        try {
            await page.focus(nnz.searchInput);
            await page.type(nnz.searchInput, id);
            await page.keyboard.down('Enter');
            await page.waitForSelector(nnz.searchResultLink);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Товар не найден на сайте nnz-ipc.ru';
            await browser.close();
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
            }, nnz.searchResultLink);


            await page.click(nnz.searchResultLink);
            await page.waitForSelector(nnz.featerNameElement);

            device.nnzFeatures = await page.evaluate(selector => {
                let elements = document.querySelectorAll(selector);
                let res = [];
                for(let i = 0; i < elements.length; i++) {
                    if(!elements[i].classList.contains('group-name')) res.push(elements[i].innerText);
                }
                return res;
            }, nnz.featerNameElement);


        }

        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Проблема с доступом к характеристикам на сайте nnz-ipc.ru';
            await browser.close();
            return resultObj;
        }

        console.log(device);


        //Идем на сайт поставщика
        try {
            await page.goto(site.url);
            await page.waitForSelector(site.searchInput);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Проблема с доступом к выбранному сайту';
            await browser.close();
            return resultObj;
        }

        //Пробуем найти товар на сайтк поставщика
        try {
            await page.type(site.searchInput, device.name);
            await page.focus(site.searchInput);
            await page.keyboard.down('Enter');
            await page.waitForSelector(site.searchResultLink, {timeout: 15000});
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Товар не найден на выбранном сайте';
            await browser.close();
            return resultObj;
        }

        //Берем названия характеристик с сайта поставщика
        try {

            await page.click(site.searchResultLink);
            await page.waitForSelector(site.featureBlock);

            device.siteFeatures = await page.evaluate( selector => {
                let elements = document.querySelectorAll(selector);
                let res = [];
                for(let i = 0; i < elements.length; i++) {
                    res.push(elements[i].innerText);
                }
                return res;
            }, site.featerNameElement);

        }

        catch (e) {
            resultObj.success = false;
            resultObj.data = 'Проблема с доступок к карточке товара на выбранном сайте';
            await browser.close();
            return resultObj;
        }


        resultObj.data = device;
        await browser.close();

        return resultObj;

    })();
}

module.exports = getFeatures;
