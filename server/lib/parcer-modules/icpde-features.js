const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');


/*
*   @desc - Функция которая парсит название свойст и возвращает их в виде массива строк
*   @product: String - наименование товар 1 в 1, как у производителя
*   @return: Object - объект resultObj:
            @success: Bool -  статус успешности выполнения
            @data: Array || String  - массив со списком характеристик ['size', 'processor', 'memory'] или строку с текстом ошибки
*/
function parseFeatures(id) {

    return ( async () => {

        const icpde = config.icpde;
        const nnz = config.nnz;
        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();

        //Объект результата
        let resultObj = {
            success: true,
            data: null
        };

        //Объект товара, который содержит название, артикул, а также характеристики с сайта nnz и выбранного сайта
        let device = null;



        //Пробуем войти на сайт nnz
        try {
            await page.goto(nnz.url, {timeout: 30000});
            await page.waitForSelector(nnz.searchInput)
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Сайт www.nnz-ipc.ru не доступен';
            await browser.close();
            return resultObj;
        }

        //Вводим артикул товара в поле поиска
        try {
            await page.focus(nnz.searchInput);
            await page.type(nnz.searchInput, id);
            await page.keyboard.down('Enter');
            await page.waitForSelector(nnz.searchResultLink);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Товар не найден на сайте www.nnz-ipc.ru';
            await browser.close();
            return resultObj;
        }

        //Кликаем по ссылке на товар который показан в выдаче и выполняем код, получающий все характеристики
        try {

            //Получаем название и ссылку на товар
            device = await page.evaluate(linkSelector => {
                let element = document.querySelector(linkSelector);
                return {
                    name: element.innerHTML,
                    link: 'http://new.nnz-ipc.ru/' + element.getAttribute('href')
                };
            }, nnz.searchResultLink);

            //Переходим в карточку товара и получаем все характеристи
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


        //Пробуем войти на сайт icpde
        try {
            await page.goto(icpde.url, {timeout: 30000});
            await page.waitForSelector(icpde.searchInput);
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Сайт www.icp-deutschland.de не доступен';
            await browser.close();
            return resultObj;
        }

        console.log(device);
        //Вводим название товара в поле поиска
        try {

            //Меняем язык на странице
            await page.click(icpde.changeLang);
            await page.waitForSelector(icpde.searchInput);

            await page.focus(icpde.searchInput);
            await page.type(icpde.searchInput, device.name);
            await page.keyboard.down('Enter');
            await page.waitForSelector(icpde.searchResultLink);
        }
        catch (err) {
            resultObj.success = false;
            resultObj.data = 'Введенный вами товар не найден на сайте www.icp-deutschland.de';
            await browser.close();
            return resultObj;
        }

        //Кликаем по ссылке на товар который показан в выдаче и выполняем код, получающий все характеристики
        try {
            await page.click(icpde.searchResultLink);
            await page.waitForSelector(icpde.featerNameElement);
            device.siteFeatures = await page.evaluate( (featureSelector) => {

                let features = document.querySelectorAll(featureSelector);
                let result = [];

                for(let i = 0; i < features.length; i++) {
                    result.push(features[i].innerText);
                }

                return result;

            }, icpde.featerNameElement)
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Поле характеристик не доступно для данного товара на сайте www.icp-deutschland.de';
            await browser.close();
            return resultObj;
        }

        await browser.close();
        resultObj.data = device;
        return resultObj;

    })();
}

module.exports = parseFeatures;
