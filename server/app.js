const path = require('path');
const express = require('express');
const router = require('./routes/routes.js')


let app = express();


app.set('port', process.env.PORT || 3000);

//Отработка роутов
app.use('/', router);
app.use('/getsales', router);


//Статика
app.use(express.static(path.resolve('../public')));

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
