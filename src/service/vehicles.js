'use strict';

module.exports = function(app) {

    let Vehicles = app.locals.model.vehicles;
    let Validate = require('../helpers/validator');

    let output = {
        create: function(params, realm_id) {
            return new Promise((resolve, reject) => {

                let data = Validate.object(params, 'vehicles_create');
                data.realm_id = realm_id;

                Vehicles.select('id', { plate: data.plate, realm_id: data.realm_id }).then(result => {
                    if (result[0]) return resolve('Vehicle already exists');
                    Vehicles.insert(data).then(resolve('Vehicle added.')).catch(reject);
                }).catch(reject);

            });
        },
        read: function(realm_id, vehicle_id) {
            let where = { realm_id: realm_id };
            if (vehicle_id) where.id = vehicle_id;
            return Vehicles.select(['id', 'plate', 'make', 'model'], where);
        },
        update: function(body, vehicle_id, realm_id) {
            return Vehicles.update(Validate.body(body, 'vehicles_update'), { id: vehicle_id, realm_id: realm_id });

        },
        delete: function(vehicle_id, realm_id) {
            return Vehicles.delete({ id: vehicle_id, realm_id: realm_id });
        }
    };

    return output;

};
