"use strict";
const TABLE_NAME = 'cameras';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Cameras = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        select: function(data, where) {
            return Knex(TABLE_NAME).select(data).where(where);
        },
        insert: function(data) {
            return Knex(TABLE_NAME).insert(data).returning('id');
        },
        update: function(data, where) {
            return Knex(TABLE_NAME).update(data).where(where);
        },
        delete: function(where) {
            return Knex(TABLE_NAME).del().where(where);
        }


    });

    return Bookshelf.model(TABLE_NAME, Cameras);
};
