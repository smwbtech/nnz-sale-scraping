const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const parcer = require('./../lib/parcer');
const db = require('./../lib/db');
const xlsx = require('xlsx-writestream');

let router = express.Router();
let upload = multer({ dest: './public/upload/' });

//Главная страница
router.get('/', (req, res, err) => {
    if(err) console.log(err);
    res.sendFile(path.resolve('../public/index.html'));
});

//Генериуем файл распродажи
router.post('/getsales', upload.single('tablefile'), (req, res, err) => {
    if(err) console.error(err);
    console.log(req.file);
    let tmp_path = req.file.path;
    let target_path = `./public/upload/${req.file.originalname}`;
    let src = fs.createReadStream(tmp_path);
    let dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    fs.unlink(tmp_path);
    src.on('end', () => {
        res.send('ok');
        parcer.parseFile(target_path)
        .then( (res) => {
            let date = new Date();
            console.log('Время начала:' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
            return parcer.getLinks(res)
        })
        .then( (res) => {
            let date = new Date();
            let data = res;
            console.log('Время окончания:' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
            xlsx.write('links.xlsx', data, (err) => {
                if(err) console.log(err);
            });
        });
    });

});

module.exports = router;
