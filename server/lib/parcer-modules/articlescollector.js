const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const config = require('./../config');

function collect(link) {
    return (async () => {

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        //Основные селекторы nnz
        const nnz = {
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

        var articles = await page.evaluate( async (articleSelector, buttonSelector) => {

                let result = await new Promise( (resolve, rejected) => {
                    let intervalId = setInterval( () => {
                        if(document.querySelector('.btn_add.show_catalog') !== null) {
                            document.querySelector('.btn_add.show_catalog').click();
                        }
                        else {
                            let res = [];
                            let articles = document.querySelectorAll('.prev-product_l .prev-product_art');
                            for(let i = 0; i < articles.length; i++) {
                                res.push(articles[i].innerText.slice(9));
                            }
                            console.log(res);
                            resolve(res);
                            clearInterval(intervalId);
                        }
                    }, 3000);
                });
                return result;

        }, nnz.articleBlock, nnz.buttonMore);


        console.log(articles);
        await browser.close();
        return articles;
    })();
}

module.exports = collect;
