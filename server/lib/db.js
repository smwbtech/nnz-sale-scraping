const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const assert = require('assert');
const config = require('./config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const url = `mongodb://${config.dbUser}:${config.dbPassword}@cluster0-shard-00-00-s7ik5.mongodb.net:27017,cluster0-shard-00-01-s7ik5.mongodb.net:27017,cluster0-shard-00-02-s7ik5.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;
const dbName = config.dbName;

// Use connect method to connect to the server

let db = {

    //Тестим соединение с БД
    connect() {
        MongoClient.connect(url, (err, client) => {
          assert.equal(null, err);
          console.log("Connected successfully to server");
          const db = client.db(dbName);
          client.close();
        });
    },

    //Регистрация нового пользователя
    registration(userObj) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userObj.password, salt, (err, hash) => {
                if(err) {
                    console.error(err);
                    // TODO: сделать возврат ошибки
                }
                else {
                    userObj.password = hash;
                    MongoClient.connect(url, (err, client) => {
                      assert.equal(null, err);
                      const db = client.db(dbName);
                      db.collection('users')
                      .insertOne(userObj, (err, res) => {
                          assert.equal(null, err);
                          assert.equal(1, res.insertedCount);
                          return true;

                      });
                      client.close();
                    });
                }
            });
        });
    },

    //Авторизация пользователя пользователя
    login(login, password) {
        let result = {
            status: true,
            message: ''
        };
        return MongoClient.connect(url)

            .then( (client) => {
                const db = client.db(dbName);
                return db.collection('users').find({login: login}).toArray();
            })

            .then( (user) => {
                if(user.length === 0) {
                    result.status = false;
                    result.message = 'Неверное сочетание логина и пароля';
                    return result;
                }

                return bcrypt.compare(password, user[0].password)
                .then( (res) => {
                    if(!res) {
                        result.status = false;
                        result.message = 'Неверное сочетание логина и пароля';
                        return result;
                    }
                    else {
                        result.message = jwt.sign({
                          exp: Math.floor(Date.now() / 1000) + (60 * 60),
                          data: user[0]._id
                        }, config.secret);
                        return result;
                    }
                });
            })
            .catch( (err) =>  {
                return err;
            });
    },

    //Аутентификация пользователя
    checkUser(token) {
        return new Promise( (resolve, rejected) => {

            try {
                let id = new ObjectId(jwt.verify(token, config.secret).data);
                resolve(id);
            }
            catch(err) {
                console.error(err);
                rejected(false);
            }

        })
        .then( (id) => {
            return MongoClient.connect(url)
            .then( (client) => {
                const db = client.db(dbName);
                return db.collection('users').find({_id: id}).toArray();
            })
            .then( (user) => {
                if(user.length === 0) return false;
                return true;

            })
            .catch( err => console.error(err));
        })

    },

    //Сохранение схемы поиска в бд в БД
    saveSchema(token, schema) {
        let id = jwt.decode(token).data;
        let dbUserId = new ObjectId(id);
        schema.userId = id;
        return MongoClient.connect(url)
        .then( (client) => {
            const db = client.db(dbName);
            return db.collection('schemas').insert(schema);
        })
        .catch ( (err) => {
            return err;
        });
    },

    //Получаем все схемы поиска пользователя
    getSchemas(token) {
        let id = jwt.decode(token).data;
        return MongoClient.connect(url)
        .then( (client) => {
            const db = client.db(dbName);
            return db.collection('schemas').find({userId: id}).toArray();
        })
        .catch( (err) => {
            return err;
        });
    },

    //Получаем одну схему по ее id
    getSchema(id) {
        let dbSchemaId = new ObjectId(id);
        return MongoClient.connect(url)
        .then( (client) => {
            const db = client.db(dbName);
            return db.collection('schemas').find({_id: dbSchemaId}).toArray();
        })
        .catch( (err) => console.log(err));
    },

    //Сохраняем результаты поиска в БД
    saveSearchResults(searchResObj) {
        return MongoClient.connect(url)
        .then( (client) => {
            const db = client.db(dbName);
            return db.collection('searchResults').insert(searchResObj);
        })
        .catch( (err) => {
            console.error(err);
        })
    },

    //Находим результат поиска по id
    getSearchResults(id) {
        let dbSchemaId = new ObjectId(id);
        return MongoClient.connect(url)
        .then( (client) => {
            const db = client.db(dbName);
            return db.collection('searchResults').find({_id: dbSchemaId}).toArray();
        })
        .catch( (err) => console.log(err));
    },

}

module.exports = db;
