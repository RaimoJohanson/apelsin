"use strict";
const TABLE_NAME = 'cameras';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Cameras = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        select: function(col, where) {
            if (!col) col = '*';
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .where(where)
                    .then(resolve)
                    .catch(reject);

            });
        },
        insert: function(col) {

            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(col)
                    .returning('id')
                    .then(resolve)
                    .catch(reject);
            });
        },
        update: function(col, where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .update(col)
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

    return Bookshelf.model(TABLE_NAME, Cameras);
};
