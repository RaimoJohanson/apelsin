"use strict";
const TABLE_NAME = 'rules';

var moment = require('moment');

module.exports = function(app) {

    let Bookshelf = app.get("bookshelf");
    let Knex = Bookshelf.knex;

    let Rules = Bookshelf.Model.extend({
        "tableName": TABLE_NAME
    }, {
        find: function(columns, opts = {}) {

            let qb = Knex(TABLE_NAME);

            if (opts['where'] && Array.isArray(opts['where'])) opts['where'].forEach(clause => { qb.where(clause[0], clause[1], clause[2]) });
            else if (opts['where'] && typeof(opts['where']) === 'object') qb.where(opts.where);

            if (opts['whereNotNull'] && Array.isArray(opts['whereNotNull'])) opts['whereNotNull'].forEach(clause => { qb.whereNotNull(clause) });
            else if (opts['whereNotNull']) qb.whereNotNull(opts.whereNotNull);

            if (opts['count']) qb.count(opts.count);
            //else if (opts['count'] && Array.isArray(opts['count'])) opts['count'].forEach(clause => { qb.count(clause) });

            if (opts['whereIn']) qb.whereIn(opts.whereIn[0], opts.whereIn[1]);
            if (opts['whereRaw']) qb.whereRaw(opts.whereRaw);
            if (opts['orderBy']) qb.orderBy(opts.orderBy[0], opts.orderBy[1]);
            if (opts['limit']) qb.limit(Number(opts.limit));
            if (opts['page']) qb.offset((opts.page * opts.limit - opts.limit));

            qb.select(columns);

            return qb;
        },
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

    return Bookshelf.model(TABLE_NAME, Rules);
};
