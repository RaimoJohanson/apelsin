"use strict";
const TABLE_NAME = 'logs';

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Logger = Bookshelf.Model.extend({
        'tableName': TABLE_NAME,
        create: function(user, params) {

            params.updated_by = user.get('id');
            return this.save(params);
        },
    }, {
        insert: function(data) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .insert(data)
                    .returning('id')
                    .then(id => resolve(id[0]))
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
        select: function(data, where) {
            return new Promise((resolve, reject) => {
                Knex(TABLE_NAME)
                    .select(data)
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
        },
    });
    return Bookshelf.model(TABLE_NAME, Logger);
};
