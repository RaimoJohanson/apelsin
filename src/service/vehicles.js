'use strict';

module.exports = function(app) {

    let Vehicles = app.locals.model.vehicles;
    let Validate = require('../helpers/validator');

    let output = {
        create: function(body, realm_id) {
            return new Promise((resolve, reject) => {
                body.realm_id = realm_id;
                let exp = ['plate', 'make', 'model', 'realm_id'];
                let data = Validate.object(body, exp);

                Vehicles.selectWhere('id', { plate: data.plate, realm_id: data.realm_id }).then(result => {
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
            let exp = ['make', 'model', 'plate'];
            return Vehicles.update(Validate.object(body, exp), { id: vehicle_id, realm_id: realm_id });

        },
        delete: function(vehicle_id, realm_id) {
            return Vehicles.delete({ id: vehicle_id, realm_id: realm_id });
        }
    };

    return output;

};
