const fs = require('fs');
const xlsx2json = require('xlsx2json');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

//Модули парсера
const sales = require('./parcer-modules/sales');
const features = require('./parcer-modules/features');

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
                        'Вендор': 'D',
                        'Гарантия': 'E',
                        'Причина распродажи': 'F',
                        'Снят с производства': 'G',
                        'Дата снятия с производства': 'H',
                        'Спеццена $': 'I'
                    }
                }
            )
            .then( (res) => {
                return res;
            });
        },

        //Модуль распродажи
        getLinks: sales,

        //Модуль характеристик
        getFeatures: features
}
