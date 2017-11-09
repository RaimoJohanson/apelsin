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

                var getLastInteractions = Logs.find(['accepted', 'plate', 'reason', 'created_at'], { where: { realm_id: realm_id }, limit: 5, orderBy: ['created_at', 'desc'] })
                var getCameras = Cameras.select(['id', 'asset_tag', 'alias', 'ip_address'], { realm_id: realm_id })
                var getStatistics = Statistics.interactions.today(realm_id)


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
