'use strict';

/****
  Database ORM
  Make circular relations comfortable
****/

const DB_CONFIG = {
    client: 'mysql',
    connection: {
        host: "localhost",
        //port: "5432",
        user: "raimoj",
        //password: "demo",
        database: "c9",
        charset: "UTF8",
        timezone: "EET",
    },
    debug: false
};

var knex = require('knex')(DB_CONFIG);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

module.exports.bookshelf = bookshelf;
