const fs = require('fs');
const express = require('express');
const multer = require('multer');
const parcer = require('./lib/parcer');
const xlsx = require('xlsx-writestream');

let app = express();
let upload = multer({ dest: './public/upload/' });

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.get('/', (req, res, err) => {
    if(err) console.error(err);
    res.render('index');
});

app.post('/sendfile', upload.single('tablefile'), (req, res, err) => {
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
        .then( (res) => parcer.getLinks(res))
        .then( (res) => {
            console.log('thans all');
            let data = res;
            xlsx.write('links.xlsx', data, (err) => console.log(err));
        });
    });

});

app.use(express.static(`${__dirname}/public`));

// 404
app.use( (req, res) => {
    res.status(404);
    console.log(404);
    res.status(404);
});

// 500
app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.send('500 - server error');
});

app.listen(app.get('port'), () => {
    console.log('Server is running on 3000 port');
})
