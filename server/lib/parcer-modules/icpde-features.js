const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');


/*
*   @desc - Функция которая парсит название свойст и возвращает их в виде массива строк
*   @product - наименование товар 1 в 1, как у производителя
*   @return - объект resultObj:
            @success: bool -  статус успешности выполнения
            @data: array || string  - массив со списком характеристик ['size', 'processor', 'memory'] или строку с текстом ошибки
*/
function parseFeatures(product) {

    return ( async () => {

        const icpde = config.icpde;
        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();
        let resultObj = {
            success: true,
            data: null
        };

        //Пробуем войти на сайт
        try {
            await page.goto(icpde.url, {timeout: 30000});
            await page.waitForSelector(icpde.searchInput)
        }
        catch(err) {
            resultObj.success = false;
            resultObj.data = 'Сайт www.icp-deutschland.de не доступен';
            await browser.close();
            return resultObj;
        }

        console.log(product);
        //Вводим название товара в поле поиска
        try {
            await page.focus(icpde.searchInput);
            await page.type(icpde.searchInput, product);
            await page.keyboard.down('Enter');
            await page.waitForSelector(icpde.searchResultLink, {timeout: 30000});
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
            resultObj.data = await page.evaluate( (featureSelector) => {

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
        return resultObj;

    })();
}

module.exports = parseFeatures;
