"use strict";
const TABLE_NAME = 'realms';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Realms = Bookshelf.Model.extend({
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
        "userRealms": function(col, ids) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .whereIn('id', ids)
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
        "insert": function(col, admin_id) {
            col.created_by = admin_id || null;
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(col)
                    .returning('id')
                    .then(resolve)
                    .catch(reject);
            });
        },
        "update": function(col, where, admin_id) {
            col.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .update(col)
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

    return Bookshelf.model(TABLE_NAME, Realms);
};
