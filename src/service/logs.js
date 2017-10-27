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
            return new Promise((resolve, reject) => {
                let exp = ['accepted', 'plate', 'file_path', 'camera_id', 'reason', 'realm_id', 'vehicle_id'];
                console.log('Logging event');
                Logs.insert(Validate.object(data, exp)).then(resolve).catch(reject);
            });
        },
        read: function(realm_id) {
            return new Promise((resolve, reject) => {
                Cameras.selectWhere('id', { realm_id: realm_id }).then(cameras => {

                    let log_output = [];
                    async.each(cameras, (camera, cb) => {
                        Logs.select('*', { camera_id: camera.id }).then(result => {

                            log_output = log_output.concat(result);

                            cb();
                        });

                    }, () => {
                        resolve(log_output);
                    });

                }).catch(reject);
            });
        },
        readOne: function(realm_id, log_id) {
            return new Promise((resolve, reject) => {

                Logs.select('*', { id: log_id }).then(result => {
                    let log = result[0];
                    if (!log) return resolve('No log found');
                    if (log.vehicle_id) {
                        Rules.selectWhere('*', { vehicle_id: log.vehicle_id }).then(rules => {
                            log.rules = rules;
                            return resolve(log);
                        });
                    }
                    else resolve(log);
                });
            });
        }

    };

    return output;

}; //end of module.exports
