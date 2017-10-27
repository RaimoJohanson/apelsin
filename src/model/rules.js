"use strict";
const TABLE_NAME = 'rules';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Rules = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        select: function(col) {
            if (!col) col = '*';
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .then(resolve)
                    .catch(reject);

            });
        },
        selectWhere: function(col, where) {
            if (!col) col = '*';
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .where(where)
                    .then(resolve)
                    .catch(reject);

            });
        },
        insert: function(data) {

            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(data)
                    .returning('id')
                    .then(resolve)
                    .catch(reject);
            });
        },
        update: function(data, where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .update(data)
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        },
        delete: function(where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .del()
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        }


    });

    return Bookshelf.model(TABLE_NAME, Rules);
};
