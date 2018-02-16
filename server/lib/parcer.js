const fs = require('fs');
const xlsx2json = require('xlsx2json');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

//Модули парсера
const sales = require('./parcer-modules/sales');
const features = require('./parcer-modules/features');
const parser2u = require('./parcer-modules/2uparser');
const featuresIcpDe = require('./parcer-modules/icpde-features');
const articlesCollector = require('./parcer-modules/articlescollector');

module.exports = {
    //Переводим xlsx в json
        parseFile(path) {
            return xlsx2json(path,
                {
                    dataStartingRow: 3,
                    mapping: {
                        'Артикул': 'A',
                        'Код вендора': 'B',
                        'Наименование': 'C',
                        'Производитель': 'D',
                        'Снят с производства': 'E',
                        'Дата снятия с производства': 'F',
                        'Розничная цена  (USD + 2%)': 'G',
                        'Цена распродажи  (USD + 2%)': 'H',
                        'Процент скидки': 'I'
                    }
                }
            )
            .then( (res) => {
                return res;
            });
        },

        //Модуль распродажи
        getLinks: sales,

        //Модуль получения названий характеристик
        getFeatures(source, id) {
            switch (source) {
                case 'ipc2u.ru':
                    let func = features;
                    return func(id);
                    break;
                case 'icp-deutschland.de':
                    return featuresIcpDe(id);
                    break;
                default:

            }
        },

        //Модуль парсинга характеристик
        parseFeatures: parser2u,

        //Модуль сбора артикулов из определенной категории товаров
        getArticles: articlesCollector


}
