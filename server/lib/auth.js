//Модуль регистрации и авторизации пользователя
const bcrypt = require('bcryptjs');
const db = require('./db');
// const salt = require('./config').salt;

module.exports = {

    //Регистрация нового пользователя
    registration(login, name, lastName, password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    console.error(err);
                    // TODO: сделать возврат ошибки
                }
                else {
                    let user = {
                        login: login,
                        password: hash,
                        name: name,
                        lastName: lastName
                    }
                }
            });
        });
    }

}
