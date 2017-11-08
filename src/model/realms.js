"use strict";
const TABLE_NAME = 'realms';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Realms = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        find: function(columns, opts) {
            let qb = Knex(TABLE_NAME);
            if (opts.related) opts.related.forEach(relation => {
                qb.leftJoin(relation.target_table, TABLE_NAME + '.' + relation.column, relation.target_table + '.' + relation.target_column);
            });

            if (opts['where'] && Array.isArray(opts['where'])) opts['where'].forEach(clause => { qb.where(clause[0], clause[1], clause[2]) });
            else if (opts['where'] && typeof(opts['where']) === 'object') qb.where(opts.where);

            if (opts['count'] && typeof(opts['count'] === 'string')) qb.count(opts.count);
            else if (opts['count'] && Array.isArray(opts['count'])) opts['count'].forEach(clause => { qb.count(clause) });

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
        insert: function(columns) {
            return Knex(TABLE_NAME).insert(columns).returning('id');
        },
        update: function(columns, where) {
            return Knex(TABLE_NAME).update(columns).where(where);
        },
        delete: function(where) {
            return Knex(TABLE_NAME).del().where(where);
        }
    });

    return Bookshelf.model(TABLE_NAME, Realms);
};
