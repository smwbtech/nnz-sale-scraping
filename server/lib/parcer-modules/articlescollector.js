const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function collect(link) {
    return (async () => {

        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();

        //Основные селекторы nnz
        const nnz = {
            productNameBlock: '.prev-product_l .prev-product_name',
            articleBlock: '.prev-product_l .prev-product_art',
            buttonMore: '.btn_add.show_catalog'
        };

        //Пробуем зайти по ссылке
        try {
            await page.goto(link, {timeout: 30000});

        }
        catch(err) {
            console.error(err)
            return err;
        }

        // Получаем артикулы, которые загрузились сразу
        console.log('we are here');

        var articles = await page.evaluate( async (articleSelector, buttonSelector, nameSelector) => {

                let result = await new Promise( (resolve, rejected) => {
                    let intervalId = setInterval( () => {
                        if(document.querySelector(buttonSelector) !== null) {
                            document.querySelector(buttonSelector).click();
                        }
                        else {
                            let res = [];
                            let names = document.querySelectorAll(nameSelector)
                            let articles = document.querySelectorAll(articleSelector);
                            for(let i = 0; i < articles.length; i++) {
                                res.push({
                                    article: articles[i].innerText.slice(9),
                                    name: names[i].innerText
                                });
                            }
                            console.log(res);
                            resolve(res);
                            clearInterval(intervalId);
                        }
                    }, 3000);
                });
                return result;

        }, nnz.articleBlock, nnz.buttonMore, nnz.productNameBlock);


        console.log(articles);
        await browser.close();
        return articles;
    })();
}

module.exports = collect;
