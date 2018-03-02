
function extractFeatures(searchRes) {

    let result = [];

    for(let i = 0; i < searchRes.length; i++) {

        let searchResult = {};
        searchResult.data = searchRes[i].data == null  ? {} : searchRes[i].data;
        searchResult.article = searchRes[i].article;
        searchResult.name = searchRes[i].name;

        var extractedFeatures = {
            'Артикул': searchResult.article,
            'Код вендора': searchResult.name,
            'Производитель': searchResult.data['Производитель'] ? replaceBrTag(searchResult.data['Производитель']) : '',
            'Форм-фактор процессорной платы': searchResult.data['Форм-фактор процессорной платы'] ? replaceBrTag(searchResult.data['Форм-фактор процессорной платы']) : '',
            'Звуковой контроллер' : searchResult.data['Звуковой контроллер'] ? findAudio(searchResult.data['Звуковой контроллер']) : '',
            'Видеоконтроллер': searchResult.data['Видеоконтроллер'] ? findVideoController(searchResult.data['Видеоконтроллер']) : '',
            'Интерфейсы': searchResult.data['Интерфейсы'] ? replaceBrTag(searchResult.data['Интерфейсы']) : '',
            'Поддержка IRIS': searchResult.data['IRIS'] ? replaceBrTag(searchResult.data['IRIS']) : '',
            'Сторожевой таймер ( WDT )': '',
            'LPT': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'lpt') : '',
            'RS-232': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-232') : '',
            'RS-232/422/485': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-232/422/485') : '',
            'RS-422/485': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-422/485') : '',
            'I2C': searchResult.data['I2C'] ? searchResult.data['I2C'].slice(0,5) + ' конт.' : '',
            'SMBus': searchResult.data['SMBus'] ? searchResult.data['SMBus'].slice(0,5) + ' конт.' : '',
            'USB 2.0': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'USB 2.0') : '',
            'USB 3.0': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'USB 3.0') : '',
            'Клавиатура / Мышь ( PS/2 )': searchResult.data['Интерфейсы ввода/вывода'] ? findKeyboard(searchResult.data['Интерфейсы ввода/вывода']) : '',
            'Serial ATA': searchResult.data['Интерфейсы ввода/вывода'] ? findPort(searchResult.data['Интерфейсы ввода/вывода'], 'SATA') + ' x SATA' : '',
            'BIOS': searchResult.data['BIOS'] ? replaceBrTag(searchResult.data['BIOS']) : '',
            'Поддерживаемые операционные системы': '',
            'Количество и тип разъемов памяти': searchResult.data['Память'] ? findMemory(searchResult.data['Память'], 'port') : '',
            'Тип памяти': searchResult.data['Память'] ? findMemory(searchResult.data['Память'], 'type') : '',
            'Максимальный объем памяти': searchResult.data['Память'] ? findMemory(searchResult.data['Память'], 'max') : '',
            'Частота памяти': searchResult.data['Память'] ? findMemory(searchResult.data['Память'], 'freq') : '',
            'Поддерживаемые блоки питания': searchResult.data['Поддерживаемые блоки питания'] ? findPowerSupply(searchResult.data['Поддерживаемые блоки питания']) : '',
            'Требуемые напряжения': '',
            'Разъем процессора': searchResult.data['Разъем процессора'] ? findLGA(searchResult.data['Разъем процессора']) : '',
            'Тип поддерживаемых процессоров': searchResult.data['Тип поддерживаемых процессоров'] ? findProcessor(searchResult.data['Тип поддерживаемых процессоров']) : '',
            'Частота процессора': '',
            'Контроллер Ethernet': searchResult.data['LAN'] ? replaceBrTag(searchResult.data['LAN']) : '',
            'Количество и тип портов': '',
            'Mini PCI': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCI Mini') : '',
            'Mini-PCIe': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCIe Mini') : '',
            'PC/104': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PC.104') : '',
            'PCI': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCI') : '',
            'PCIe x16': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCIe x16') : '',
            'PCIe x8': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCIe x8') : '',
            'PCIe x4': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCIe x4') : '',
            'PCIe x1': searchResult.data['Слоты расширения'] ? findPort(searchResult.data['Слоты расширения'], 'PCIe x1') : '',
            'Рабочая влажность, %': searchResult.data['Рабочая влажность, %'] ? findHumidity(searchResult.data['Рабочая влажность, %']) : '',
            'Рабочая температура, °C': searchResult.data['Рабочая температура, °C'] ? findTempreture(searchResult.data['Рабочая температура, °C']) : '',
            'Вес брутто, кг': searchResult.data['Вес'] ? findWeight(searchResult.data['Вес'], 'GW') : '',
            'Вес нетто, кг': searchResult.data['Вес'] ? findWeight(searchResult.data['Вес'], 'NW') : '',
            'Габаритные размеры, мм': searchResult.data['Габаритные размеры, мм'] ? replaceBrTag(searchResult.data['Габаритные размеры, мм'].replace(/(mm)/ig, 'мм')) : ''
        }

        result.push(extractedFeatures);

    }

    return result;

}

module.exports = extractFeatures;

//Helpers

/*
*   @desc - Функция которая занимается форматированием строки убирая все теги переноса строки и заменяя их символами переноса строки
*   @str: String - строка с информацией о видеопортах
*   @return: String - отформатированная строка
*/
function replaceBrTag(str) {
    return str.split('<br>').join('\r\n');
}

/*
*   @desc - Функция которая ищет вхождения в строке с портами
*   @str: String - строка с информацией о портах
*   @return: String - количество портов
*/
function findPort(str, port) {
    let pattern = new RegExp(`(\\d) x ${port}`, 'i');
    return str.match(pattern) !== null ? str.match(pattern)[1] : '';
}

/*
*   @desc - Функция которая ищет вхождения в строке с процессорами
*   @str: String - строка с информацией о процессорах
*   @return: String - отформатированная строка с информацией о процессорах
*/
function findProcessor(str) {
    let processorsArr = [
        {
            pattern: /i7/i,
            title: 'Intel Core i7'
        },
        {
            pattern: /i5/i,
            title: 'Intel Core i5'
        },
        {
            pattern: /i3/i,
            title: 'Intel Core i3'
        },
        {
            pattern: /Pentium/i,
            title: 'Intel Pentium'
        },
        {
            pattern: /Celeron/i,
            title: 'Intel Celeron'
        },
        {
            pattern: /Atom/i,
            title: 'Intel Atom'
        },
        {
            pattern: /Xeon/i,
            title: 'Intel Xeon'
        },
        {
            pattern: /AMD/i,
            title: 'AMD'
        },
        {
            pattern: /ARM/i,
            title: 'ARM'
        }
    ];
    return processorsArr.map( v => {
        let res = str.match(v.pattern);
        return res !== null ? v.title : '';
    })
    .filter( v => v ? true : false)
    .join(', ');


}

/*
*   @desc - Функция которая ищет вхождения в строке с аудиоконтроллером
*   @str: String - строка с информацией о аудиоконтроллерах
*   @return: String - отформатированная строка с информацией о аудиоконтроллерах
*/
function findAudio(str) {
    let patternsArr = [
        /(Realtek\s\w+)\s/i,
        /(AC-KIT-\w+)/i
    ];
    return patternsArr.map( v => {
        let res = str.match(v);
        return res !== null ? res[1] : ''
    })
    .filter( v => v ? true : false)
    .join('');

}

/*
*   @desc - Функция которая ищет вхождения в строке с видеоконтроллером
*   @str: String - строка с информацией о видеоконтроллерах
*   @return: String - отформатированная строка с информацией о видеоконтроллерах
*/

function findVideoController(str) {
    str = str.replace(/®/g, '');
    let patternsArr = [
        /(GMA\s\d+)/i,
        /Intel\sHD\sGraphics\sGen\s[a-z0-9/\.]+\s/i
    ];
    let result = patternsArr.map( v => {
        let res = str.match(v);
        return res !== null ? res[0] : '';
    })
    .join('');
    console.log(result);
    console.log(typeof result);
    return result;
}


/*
*   @desc - Функция которая ищет вхождения в строке с портами клавиатуры
*   @str: String - строка с информацией о портах
*   @return: String - порты клавиатуры
*/
function findKeyboard(str) {
    let pattern = /.+(\d)\sx\s.+(PS\/2)|(KB\/MS)|/i;
    let search = str.match(pattern);
    let numberOfPorts = search[1] ? search[1]  : '';
    let port = search[2] ? search[2]  : 'KB/MS';
    return numberOfPorts ? `${numberOfPorts} x ${port}` : '';
}

/*
*   @desc - Функция которая извлекает необходимую информацию о памяти устройства
*   @str: String - строка запроса. Может принимать значения:
        'max' - максимальный объем памяти
        'port' - информация о разъемах памяти
        'freq' - информация о частоте памяти
        'type' - тип памяти
*   @return: String - искомое значение
*/
function findMemory(str, param) {

    let pattern;
    let nums = ['one', 'two', 'three'];
    let res = null;

    switch (param) {
        //Ищем максимальный объекм памяти
        case 'max':
            pattern = /(max\.\s|up to\s)(\d+)GB/i;
            res = str.match(pattern);
            if(res !== null) return res[2] ? `до ${res[2]} Гб` : '';
            return '';
            break;
        //Ищем разъем памяти
        case 'port':
            let type = str.match(/(\sDIMM|SO-DIMM)/i) !== null ? str.match(/(\sDIMM|SO-DIMM)/i)[1] : '';
            let pin = str.match(/(one\s|two\s|three\s|\d\sx\s)(\d+)-pin/i);
            let pinCount = '';
            let pinNum = '';
            if(pin !== null) {
                pinCount  = nums.indexOf(pin[1].toLowerCase()) >= 0 ? (nums.indexOf(pin[1].toLowerCase()) + 1) + ' x ' : pin[1];
                pinNum = pin[2];
            }
            return type ? `${pinCount}${pinNum}-конт. ${type}` : '';
            break;
        //Ищем частоту памяти
        case 'freq':
            pattern = /(\d{3,4}|\d{3,4}\/\d{3,4}|\d{3,4}\/\d{3,4}\/\d{3,4})(\sMHz|MHz|\s)/i;
            res = str.match(pattern);
            if(res !== null) return res[1] ? res[1] : '';
            return '';
            break;
        //Ищем тип памяти
        case 'type':
            pattern = /(DDR\d|DDR|DDR\dL)/i;
            res = str.match(pattern);
            if(res !==null) return res[1] ? res[1] : '';
            return '';
            break;
        default:
            return '';
            break;
    }

}

/*
*   @desc - Функция которая ищет вхождения в строке с блоками питания
*   @str: String - строка с информацией о блоках питаня
*   @return: String - отформатированная строка с блоками питания
*/

function findPowerSupply(str) {
    let type = str.match(/(AT\/ATX|ATX)/i) !== null ? str.match(/(AT\/ATX|ATX)/)[1] : '';
    let power = str.match(/(12V\s|5v\s|5V\/12V\s|\d{1,2}~\d{1,2})/i) !== null ? str.match(/(12V\s|5v\s|5V\/12V\s|\d{1,2}~\d{1,2})/i)[1].replace(/(v)/ig, 'В') : '';
    if(type) return `${type} ${power}`;
    return '';
}

/*
*   @desc - Функция которая ищет вхождения в строке с разъемом процессора
*   @str: String - строка с информацией о разъеме
*   @return: String - отформатированная строка с разъемами
*/
function findLGA(str) {
    let pattern = /\(with Processor\)/i;
    return pattern.test(str) ? 'Впаянный процессор' : str;
}

/*
*   @desc - Функция которая ищет вхождения в строке с влажностью
*   @str: String - строка с информацией о влажности
*   @return: String - отформатированная строка с информацией о влажности
*/
function findHumidity(str) {
    let res = str.match(/(\d{1,2}.+\d{1,2}%)/i);
    return res !== null ? res[1] : '';
}

/*
*   @desc - Функция которая ищет вхождения в строке с температурой
*   @str: String - строка с информацией о температуре
*   @return: String - отформатированная строка с информацией о температуре
*/
function findTempreture(str) {
    let pattern = /(\d{1,2}.+\d{1,2}°)/i;
    let res = str.match(pattern);
    return res !== null ? `${res[1]}C` : '';
}

/*
*   @desc - Функция которая ищет вхождения в строке с весом
*   @str: String - строка с информацией о весе
*   @return: String - отформатированная строка с информацией о весе
*/
function findWeight(str, type) {
    let pattern = new RegExp(`${type}: (\\d+g|kg)`, 'i');
    let res = str.match(pattern);
    if(res !== null) {
        let resStr = '';
        /\d+(g)/i.test(res[1]) ? resStr = res[1].replace(/(g)/i, 'г') : resStr = res[1].replace(/(kg)/i, 'кг');
        return resStr;
    }
    return '';
}
