"use strict";
const TABLE_NAME = 'users';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let User = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        "select": function(col) {
            if (!col) col = '*';

            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .then(resolve)
                    .catch(reject);

            });
        },
        "selectWhere": function(col, where) {
            if (!col) col = '*';
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .where(where)
                    .then(resolve)
                    .catch(reject);

            });
        },
        "selectOrWhere": function(col, where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .where(where[0])
                    .orWhere(where[1])
                    .then(resolve)
                    .catch(reject);

            });
        },

        "selectAndWhere": function(col, where) {
            /* EXAMPLE:
            let where = [
                  ['active', '=', 1],
                  ['active_since', '<', current_month]
                ];
            */
            return new Promise((resolve, reject) => {

                Knex(TABLE_NAME)
                    .select(col)
                    .where(where[0][0], where[0][1], where[0][2])
                    .andWhere(where[1][0], where[1][1], where[1][2])
                    .then(resolve)
                    .catch(reject);

            });
        },
        "Insert": function(data) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(data)
                    .returning('id')
                    .then(resolve)
                    .catch(reject);
            });
        },
        "update": function(data, where) {
            data.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");

            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .update(data)
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        },
        "delete": function(where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .del()
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        }


    });

    return Bookshelf.model(TABLE_NAME, User);
};
