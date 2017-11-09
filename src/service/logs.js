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
                Logs.find('*', { where: { realm_id: realm_id }, limit: opts.limit, page: opts.page }).then(results => {

                    Logs.find('id', { where: { realm_id: realm_id }, count: 'id as total' }).then(count => {

                        return resolve({
                            limit: opts.limit || 20,
                            page: opts.page || 1,
                            total_pages: count[0].total % (opts.limit || 20) ? Math.floor(count[0].total / (opts.limit || 20)) + 1 : count[0].total / (opts.limit || 20),
                            data: results
                        });

                    }).catch(reject);
                }).catch(reject);
            });
        },
        readOne: function(realm_id, log_id) {
            return Logs.select('*', { realm_id: realm_id, id: log_id });
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
