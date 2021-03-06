'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const async = require('async');
module.exports = function(app) {

    let Validate = require('../helpers/validator');

    let Logs = app.locals.model.logs;
    let Rules = app.locals.model.rules;
    let Cameras = app.locals.model.cameras;

    let output = {


        create: function(data) {
            let exp = ['accepted', 'plate', 'file_name', 'camera_id', 'reason', 'realm_id', 'vehicle_id'];
            console.log('Logging event');
            return Logs.insert(Validate.object(data, exp));
        },
        read: function(realm_id, opts = {}) {
            return new Promise((resolve, reject) => {
                Logs.find(['id', 'accepted', 'plate', 'created_at', 'camera_id', 'reason', 'vehicle_id'], { where: { realm_id: realm_id }, limit: opts.limit, page: opts.page, orderBy: ['created_at', opts.order || 'desc'] }).then(results => {

                    Logs.find('id', { where: { realm_id: realm_id }, count: 'id as total' }).then(count => {

                        return resolve({
                            limit: Number(opts.limit) || 0,
                            page: Number(opts.page) || 0,
                            total_pages: count[0].total % (opts.limit || 20) ? Math.floor(count[0].total / (opts.limit || 20)) + 1 : count[0].total / (opts.limit || 20),
                            data: results
                        });

                    }).catch(reject);
                }).catch(reject);
            });
        },
        readOne: function(realm_id, log_id) {
            return Logs.select(['id', 'accepted', 'plate', 'created_at', 'camera_id', 'reason', 'vehicle_id'], { realm_id: realm_id, id: log_id });
        },
        getImage: function(realm_id, log_id) {
            return Logs.select('file_name', { realm_id: realm_id, id: log_id });
        },
        clean: function(realm_id, vehicle_id) {
            let q = {
                where: { realm_id: realm_id, vehicle_id: vehicle_id },
                orderBy: ['created_at', 'desc'],
                limit: 10
            }
            //Untested
            return new Promise((resolve, reject) => {
                Logs.find('*', q).then(results => {
                    if (results.length >= q.limit) {
                        let file = results[q.limit - 1].file_name;
                        resolve(file);
                    }
                    else resolve(results);
                }).catch(reject);
            });
        },


    };

    return output;

}; //end of module.exports
