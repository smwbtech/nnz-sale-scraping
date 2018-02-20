const fs = require('fs');
const xlsx2json = require('xlsx2json');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

//Модули парсера
const sales = require('./parcer-modules/sales');
const features2u = require('./parcer-modules/2u-features');
const parser2u = require('./parcer-modules/2u-parser');
const featuresIcpDe = require('./parcer-modules/icpde-features');
const parseIcpDe = require('./parcer-modules/icpde-parser');
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
                    return features2u(id);
                    break;
                case 'icp-deutschland.de':
                    return featuresIcpDe(id);
                    break;
                default:

            }
        },

        //Модуль парсинга характеристик
        parseFeatures(products, schema) {
            switch (schema.source) {
                case 'ipc2u.ru':
                    return parser2u(products, schema);
                    break;
                case 'icp-deutschland.de':
                    return parseIcpDe(products, schema);
                    break;
                default:

            }
        },

        //Модуль сбора артикулов из определенной категории товаров
        getArticles: articlesCollector


}
