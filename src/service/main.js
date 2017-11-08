'use strict';

module.exports = function(app) {
    const Validate = require('../helpers/validator');
    const Statistics = require('../service/statistics')(app);
    const Realms = app.locals.model.realms;
    const UsersRealms = app.locals.model.users_realms;
    const Vehicles = app.locals.model.vehicles;
    const Cameras = app.locals.model.cameras;
    const Logs = app.locals.model.logs;

    let output = {
        landing: function(ids) {
            return new Promise((resolve, reject) => {
                Realms.find(['id', 'name', 'street_number', 'street', 'city', 'region', 'country'], { whereIn: ['id', ids] }).then(resolve).catch(reject);
            });
        },
        dashboard: function(user_id, realm_id) {


            return new Promise((resolve, reject) => {

                var p1 = new Promise((resolve, reject) => {

                    Vehicles.select('*', { realm_id: realm_id }).then(resolve).catch(reject);
                });
                var p2 = new Promise((resolve, reject) => {

                    Realms.select(['id', 'name', 'street_number', 'street', 'city', 'region', 'country'], { id: realm_id }).then(resolve).catch(reject);
                });

                var p3 = new Promise((resolve, reject) => {

                    Logs.find(['accepted', 'plate', 'reason', 'created_at'], { where: { realm_id: realm_id }, limit: 5 }).then(resolve).catch(reject);

                });
                var p4 = new Promise((resolve, reject) => {

                    Cameras.select(['id', 'asset_tag', 'alias', 'ip_address'], { realm_id: realm_id }).then(resolve).catch(reject);

                });
                var p5 = new Promise((resolve, reject) => {

                    // Statistics.day(realm_id).then(resolve).catch(reject);
                    resolve({
                        total: 12,
                        accepted: 8,
                        unaccepted: 3,
                        unfamiliar: 1
                    });

                });

                Promise.all([p1, p2, p3, p4, p5]).then(values => {

                    let data = {
                        //vehicles: values[0],
                        //realm: values[1],
                        interactions: values[2],
                        cameras: values[3],
                        statistics: values[4]
                    };

                    resolve(data);

                }).catch(reject);

                //resolve(data);
            });
        }
    };

    return output;

}; //end of module.exports
