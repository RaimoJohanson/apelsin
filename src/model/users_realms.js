"use strict";
const TABLE_NAME = 'users_realms';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let UsersRealms = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        select: function(columns, where) {
            return Knex(TABLE_NAME).select(columns).where(where);
        },

        insert: function(data) {
            return Knex(TABLE_NAME).insert(data).returning('id');

        },
        update: function(data, where) {
            data.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");
            return Knex(TABLE_NAME).update(data).where(where);
        },
        delete: function(where) {
            return Knex(TABLE_NAME).del().where(where);
        }

    });

    return Bookshelf.model(TABLE_NAME, UsersRealms);
};
