'use strict';

module.exports = function(app) {
    let async = require('async');
    /*
  let realm = require('../service/user')(app);
  let taskService = require('../service/task')(app);
  let monthService = require('../service/month')(app);

*/
    let Validate = require('../helpers/validator');
    let Realms = app.locals.model.realms;
    let UsersRealms = app.locals.model.users_realms;
    let Vehicles = app.locals.model.vehicles;
    let Cameras = app.locals.model.cameras;
    let Logs = app.locals.model.logs;

    let output = {
        landing: function(ids) {
            return new Promise((resolve, reject) => {
                Realms.userRealms(['id', 'name'], ids).then(resolve).catch(reject);
            });
        },
        dashboard: function(user_id, realm_id) {


            return new Promise((resolve, reject) => {

                var p1 = new Promise((resolve, reject) => {

                    Vehicles.select('*', { realm_id: realm_id }).then(resolve).catch(reject);
                });
                var p2 = new Promise((resolve, reject) => {

                    Realms.selectWhere('*', { id: realm_id }).then(result => {
                        let r = result[0];
                        let realm = {
                            id: r.id,
                            name: r.name,
                            country: r.country,
                            region: r.region,
                            city: r.city,
                            street: r.street,
                            street_number: r.street_number
                        };
                        resolve(realm);
                    }).catch(reject);
                });

                var p3 = new Promise((resolve, reject) => {

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
                var p4 = new Promise((resolve, reject) => {

                    Cameras.selectWhere('*', { realm_id: realm_id }).then(resolve).catch(reject);

                });

                Promise.all([p1, p2, p3, p4]).then(values => {

                    let data = {
                        vehicles: values[0],
                        realm: values[1],
                        logs: values[2],
                        cameras: values[3]
                    };

                    resolve(data);

                }).catch(reject);

                //resolve(data);
            });
        }
    };

    return output;

}; //end of module.exports
