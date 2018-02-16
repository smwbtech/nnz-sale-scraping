const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx-writestream');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const ProgressBar = require('progress');
const querystring = require('querystring');

const parcer = require('./../lib/parcer');
const db = require('./../lib/db');

let router = express.Router();
let upload = multer({ dest: './public/upload/' });

//Middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(history());

//Главная страница
router.get('/', (req, res, err) => {
    if(err) console.error(err);
    res.sendFile(path.resolve('../public/index.html'));
});

//Тесты
router.post('/test', (req, res, err) => {
    if(err) console.error(err);

    // NOTE: test for parser module

    /*test start*/
    let dbSchemaId = '5a869d57bd909d25ec96cdce';
    var arr = [ { article: '6098232', name: 'IMB-H810-i2' },
      { article: '6074625', name: 'IMB-H610A' },
      { article: '6078477', name: 'NANO-HM650' },
      { article: '6044339', name: 'NANO-PV-D5251' },
      { article: '6078247', name: 'NANO-QM770' },
      { article: '6080109', name: 'WAFER-CV-N26002' },
      { article: '1163609', name: 'WAFER-LX-800' },
      { article: '6112219', name: 'HPCIE-Q170' },
      { article: '6044383', name: 'WAFER-PV-D5252' },
      { article: '6084153', name: 'PM-PV-N4551-R11' },
      { article: '6080106', name: 'NANO-CV-D25502' },
      { article: '6031977', name: 'PCIE-Q57A' },
      { article: '6044099', name: 'WSB-PV-D5251' },
      { article: '6044117', name: 'PICOe-PV-D5251' },
      { article: '6080107', name: 'NANO-CV-N26002' },
      { article: '6106057', name: 'PCISA-BT-E38451' },
      { article: '6032610', name: 'SPCIE-5100DX' },
      { article: '6078473', name: 'NANO-CV-D25501' },
      { article: '6081849', name: 'NANO-HM651-847E' },
      { article: '6074627', name: 'KINO-DH610' }];

    // parcer.getArticles('http://new.nnz-ipc.ru/catalogue/ipc/processor_boards/?filter%5Bc5de0343-a8d4-46b6-9651-07eb9bc5f57e%5D%5B%5D=IEI%E2%80%83&filter%5Bprice%5D%5Bfrom%5D=&filter%5Bprice%5D%5Bto%5D=&filter%5B95cf50ae-e181-11e6-8dc0-00155d0c1500%5D%5Bfrom%5D=&filter%5B95cf50ae-e181-11e6-8dc0-00155d0c1500%5D%5Bto%5D=&filter%5B95cf50ad-e181-11e6-8dc0-00155d0c1500%5D%5Bfrom%5D=&filter%5B95cf50ad-e181-11e6-8dc0-00155d0c1500%5D%5Bto%5D=')
    // .then( (result) => {
    //     arts = result;
    //     console.log(arts);
    //     return db.getSchema(dbSchemaId);
    // })
    db.getSchema(dbSchemaId)
    .then( (result) => {
        console.log(result);
        return parcer.parseFeatures(arr, result[0]);
    })
    .then( (data) => {
        console.log(data);
        return db.saveSearchResults({
            schemaId: dbSchemaId,
            data: data
        });
    })
    .then( (result) => {
        console.log(result);
        res.send(result);
    })
    .catch( (err) => {
        console.error(err);
        res.send(err);
    });

    /*test end*/

    //NOTE: icp-deutschland getFeatures test

    /*test start*/

    // parcer.getFeatures('icp-deutschland.de', '6098232')
    // .then( (result) => {
    //     console.log(result);
    //     res.json(result);
    // })
    // .catch( (err) => {
    //     console.log(err);
    //     res.send(err);
    // });

    /*test end*/



        //NOTE: parser module test
    // db.getSchema('5a8427a45dcf5d2d7c722168')
    // .then( (result) => {
    //     parcer.parseFeatures('6074856', result[0])
    //     .then( (data) => {
    //         console.log(data);
    //         res.send(data);
    //     })
    //     .catch( (err) => {
    //         console.error(err);
    //         res.send(err);
    //     })
    // })
    // .catch( (err) => console.error(err));
});

//Логин
router.post('/login', (req, res, err) => {
    if(err) console.error(err);
    console.log(req.body);
    db.login(req.body.login, req.body.password)
    .then( (result) => {
        res.json(result);
    }).catch( (err) => console.error(err));
});

//Аутентификация
router.get('/checkuser', (req, res, err) => {
    if(err) console.error(err);
    let token = req.get('Authorization').slice(7);
    db.checkUser(token)
    .then( (result) => {
        console.log('res ' + result);
        res.send(result);
    })
    .catch( (err) => {
        console.error(err);
        res.send(false);
    });
});

//Генериуем файл распродажи
router.post('/getsales', upload.single('tablefile'), (req, res, err) => {
    if(err) console.error(err);
    console.log(req.file);
    let tmp_path = req.file.path;
    let target_path = path.resolve(`./../public/upload/${req.file.originalname}`);
    let src = fs.createReadStream(tmp_path);
    let dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    fs.unlink(tmp_path);
    src.on('end', () => {
        parcer.parseFile(target_path)
        .then( (result) => {
            let date = new Date();
            let barId = date.getTime() + '_';
            let bar = new ProgressBar('  Прогресс: [:bar] :percent', {
                complete: '|',
                incomplete: '.',
                width: 20,
                total: result[0].length
            });
            bar.id = barId;

            console.log('Время начала:' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
            global.progressBars.push(bar);

            res.json({bar: barId});

            return parcer.getLinks(result, bar);
        })
        .then( (res) => {
            let date = new Date();
            let data = res;
            console.log('Время окончания:' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
            xlsx.write(path.resolve('./../public/upload/links.xlsx'), data, (err) => {
                if(err) console.log(err);
            });
        })
        .catch( (err) => console.error(err));
    });

});

//Показываем прогресс
router.get('/salesprogress', (req, res, err) => {
    if(err) console.error(err);
    let id = req.query.id;
    let bar = global.progressBars.find( v => v.id == id);
    if(bar.total > bar.curr) {
        let progress = {
            total: bar.total,
            current: bar.curr
        };
        res.json(progress);
    }
    else {
        let progress = {
            total: bar.total,
            current: bar.curr,
            link: '/upload/links.xlsx'
        };
        res.json(progress);
    }

});

//Получаем схему с выбранного сайта
router.get('/getschema', (req, res, err) => {
    if(err) console.log(err);
    let id = req.query.id;
    let source = req.query.source;
    parcer.getFeatures(source, id)
    .then( (result) => {
        console.log(result);
        res.json(result);
    })
    .catch( (err) => {
        console.error(err);
        resultObj.success = false;
        res.data = err;
        res.json(resultObj);
    });
});

//Сохраняем схему созданную пользователем
router.post('/saveschma', (req, res, err) => {
    if(err) console.error(err);
    let token = req.get('Authorization').slice(7);
    let schema = req.body;
    db.saveSchema(token, schema)
    .then( (result) => {
        let responseObj = {
            success: true,
            data: result.ops[0]
        };
        res.send(responseObj);
    })
    .catch( (err) => {
        let responseObj = {
            success: false,
            data: 'Ошибка соединения с базой данных'
        };
        res.send(responseObj);
    });

});

//Получаем существующие схемы
router.get('/getschemas', (req, res, err) => {
    if(err) console.log(err);
    let token = req.get('Authorization').slice(7);
    let responseObj = {
        success: true,
        data: ''
    };
    db.getSchemas(token)
    .then( (result) => {
        responseObj.data = result;
        res.send(responseObj);
    })
    .catch( (err) => {
        responseObj.success = false;
        responseObj.data = "Ошибка соединения с базой данных";
        res.send(responseObj);
    });
});


module.exports = router;
