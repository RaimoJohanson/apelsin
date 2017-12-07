'use strict';

module.exports = function(app) {

    let Vehicles = app.locals.model.vehicles;
    let Validate = require('../helpers/validator');

    let output = {
        create: function(params, realm_id) {
            return new Promise((resolve, reject) => {
                let data = Validate.body(params, 'vehicles_create');
                data.realm_id = realm_id;

                Vehicles.select('id', { plate: data.plate, realm_id: data.realm_id }).then(result => {
                    if (result[0]) return resolve('Vehicle already exists');
                    Vehicles.insert(data).then(resolve('Vehicle added!')).catch(reject);
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
        },
        autocomplete: function(input, realm_id) {
            /*
            return new Promise((resolve, reject) => {

                if (input.length < 2) return reject({ status_code: 412, status: 'INVALID_REQUEST', message: 'Input string length must be at least 2 characters.' });

                let columns = ['id', 'plate', 'make', 'model'];

                Vehicles.autocomplete(columns, input, realm_id).then(result => {
                    if (!result.length) return reject({ status_code: 200, status: 'ZERO_RESULTS', message: 'No vehicles found' });
                    else return resolve(result);
                });

            });
            */
            let columns = ['id', 'plate', 'make', 'model'];
            return Vehicles.autocomplete(columns, input, realm_id);
        }
    };

    return output;

};
