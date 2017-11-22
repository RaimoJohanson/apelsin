'use strict';
const async = require('async');
module.exports = function(app) {

    const Validate = require('../helpers/validator');
    const Realms = app.locals.model.realms;
    const UsersRealms = app.locals.model.users_realms;
    const Statistics = require('../service/statistics')(app);

    const Cameras = app.locals.model.cameras;
    const Logs = app.locals.model.logs;

    let output = {

        create: function(data, creator_id) {
            return new Promise((resolve, reject) => {
                data.created_by = creator_id;

                Realms.insert(Validate.body(data, 'realms_create')).then(new_realm => {

                    UsersRealms.insert({ user_id: creator_id, realm_id: new_realm[0], role: 'OWNER' }).then(() => {

                        return resolve('Realm created');
                    });

                });
            });
        },
        read: function(realm_id) {
            return Realms.select('*', { id: realm_id });
        },
        update: function(data, realm_id) {
            return Realms.update(Validate.body(data, 'realms_update'), { id: realm_id });
        },
        delete: function(realm_id) {
            return Realms.delete({ id: realm_id });
        },
        landing: function(ids) {
            return new Promise((resolve, reject) => {
                Realms.find(['id', 'name', 'street_number', 'street', 'city', 'region', 'country'], { whereIn: ['id', ids] }).then(resolve).catch(reject);
            });
        },
        dashboard: function(user_id, realm_id) {


            return new Promise((resolve, reject) => {

                var getLastInteractions = Logs.find(['accepted', 'plate', 'reason', 'created_at'], { where: { realm_id: realm_id }, limit: 5, orderBy: ['created_at', 'desc'] });
                var getCameras = Cameras.select(['id', 'asset_tag', 'alias', 'ip_address'], { realm_id: realm_id });
                var getStatistics = Statistics.interactions.today(realm_id).catch(reject);


                Promise.all([getLastInteractions, getCameras, getStatistics]).then(values => {
                    let data = {
                        interactions: values[0],
                        cameras: values[1],
                        statistics: values[2]
                    };

                    resolve(data);

                }).catch(reject);

                //resolve(data);
            });
        }

    };

    return output;

}; //end of module.exports
