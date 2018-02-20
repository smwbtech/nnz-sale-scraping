
function extractFeatures(searchResult) {

    const extractedFeatures = {
        'Артикул': searchResult.article,
        'Код вендора': searchResult.name,
        'Производитель': searchResult.data['Производитель'],
        'Форм-фактор процессорной платы': searchResult.data['Форм-фактор процессорной платы'],
        'Звуковой контроллер' : searchResult.data['Звуковой контроллер'],
        'Видеоконтроллер': searchResult.data['Видеоконтроллер'],
        'Интерфейсы': replaceBrTag(searchResult.data['Интерфейсы']),
        'Поддержка IRIS': searchResult.data['IRIS'],
        'Сторожевой таймер ( WDT )': '',
        'LPT': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'lpt'),
        'RS-232': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-232'),
        'RS-232/422/485': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-232/422/485'),
        'RS-422/485': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'RS-422/485'),
        'I2C': searchResult.data['I2C'] ? searchResult.data['I2C'].slice(0,5) + ' конт.' : '',
        'SMBus': searchResult.data['SMBus'] ? searchResult.data['SMBus'].slice(0,5) + ' конт.' : '',
        'USB 2.0': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'USB 2.0'),
        'USB 3.0': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'USB 3.0'),
        'Клавиатура / Мышь ( PS/2 )': , //TODO: фунуция для поиска портов клавы
        'Serial ATA': findPort(searchResult.data['Интерфейсы ввода/вывода'], 'SATA') + ' x SATA',
        'BIOS': searchResult.data['BIOS'],
        'Поддерживаемые операционные системы': '',
        'Количество и тип разъемов памяти': '',
        'Максимальный объем памяти': '',
        'Частота памяти': '',
        'Поддерживаемые блоки питания': '',
        'Требуемые напряжения': '',
        'Разъем процессора': '',
        'Тип поддерживаемых процессоров': '',
        'Контроллер Ethernet': '',
        'Количество и тип портов': '',
        'Mini PCI': '',
        'Mini-PCIe': '',
        'PC/104': '',
        'PCI': '',
        'PCI Express': '',
        'Рабочая влажность, %': '',
        'Рабочая температура, °C': '',
        'Вес брутто, кг': '',
        'Вес нетто, кг': '',
        'Габаритные размеры, мм': ''
    }

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
