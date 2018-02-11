const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('./config');
const bcrypt = require('bcryptjs');

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
                          console.log(res);

                      });
                      console.log("Connected successfully to server");
                      client.close();
                    });
                }
            });
        });
    }

}

module.exports = db;
