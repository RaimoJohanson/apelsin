'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
module.exports = function(app) {

    let Cameras = app.locals.model.cameras;
    let Validate = require('../helpers/validator');

    let output = {

        create: function(params, realm_id) {
            return new Promise((resolve, reject) => {

                let data = Validate.body(params, 'cameras_create');
                data.realm_id = realm_id;

                Cameras.select('id', { asset_tag: data.asset_tag, realm_id: data.realm_id }).then(result => {
                    if (result[0]) return resolve('Camera already exists');
                    Cameras.insert(data).then(resolve('Camera added.')).catch(reject);
                }).catch(reject);

            });
        },
        read: function(realm_id) {
            return Cameras.select(['id', 'asset_tag', 'ip_address', 'alias'], { realm_id: realm_id })
        },
        update: function(data, vehicle_id, realm_id) {
            return Cameras.update(Validate.body(data, 'cameras_update'), { id: vehicle_id, realm_id: realm_id });
        },
        delete: function(camera_id, realm_id) {
            return Cameras.delete({ id: camera_id, realm_id: realm_id })
        }
    };

    return output;

}; //end of module.exports
