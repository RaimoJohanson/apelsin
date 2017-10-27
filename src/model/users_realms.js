"use strict";
const TABLE_NAME = 'users_realms';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let UsersRealms = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        "Select": function(col) {
            if (!col) col = '*';

            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .then(resolve)
                    .catch(reject);

            });
        },
        "SelectWhere": function(col, where) {
            if (!col) col = '*';
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(col)
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        },
        "Insert": function(col, admin_id) {
            col.created_by = admin_id || null;
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(col)
                    .returning('id')
                    .then(resolve)
                    .catch(reject);
            });
        },
        "Update": function(col, where, admin_id) {
            col.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");
            col.updated_by = admin_id || null;
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .update(col)
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        },
        "Delete": function(where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .del()
                    .where(where)
                    .then(resolve)
                    .catch(reject);
            });
        }


    });

    return Bookshelf.model(TABLE_NAME, UsersRealms);
};
