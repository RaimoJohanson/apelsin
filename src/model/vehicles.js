"use strict";
const TABLE_NAME = 'vehicles';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Vehicles = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        find: function(columns, opts) {
            let qb = Knex(TABLE_NAME);

            if (opts['where'] && Array.isArray(opts['where'])) opts['where'].forEach(clause => { qb.where(clause) });
            else if (opts['where'] && typeof(opts['where']) === 'object') qb.where(opts.where);
            if (opts['whereIn']) qb.whereIn(opts.whereIn[0], opts.whereIn[1]);
            if (opts['whereRaw']) qb.whereRaw(opts.whereRaw);
            if (opts['orderBy']) qb.orderBy(opts.orderBy[0], opts.orderBy[1]);
            if (opts['limit']) qb.limit(opts.limit);
            if (opts['offset']) qb.offset(opts.offset);

            qb.select(columns);
            return qb;
        },
        select: function(columns, where) {
            return Knex(TABLE_NAME).select(columns).where(where);
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
            return Knex(TABLE_NAME).del().where(where);
        },
        autocomplete: function(columns, input, realm_id) {
            let qb = Knex(TABLE_NAME).select(columns);
            qb.where('realm_id', '=', realm_id);

            qb.andWhere(function() {
                this.where('plate', 'like', '%' + input + '%')
                    .orWhere('make', 'like', '%' + input + '%')
                    .orWhere('model', 'like', '%' + input + '%');

            });



            return qb;
        },


    });

    return Bookshelf.model(TABLE_NAME, Vehicles);
};
