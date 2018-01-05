'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
module.exports = function(app) {

    let Cameras = app.locals.model.cameras;
    let Validate = require('../helpers/validator');

    let output = {

        create: function(body, realm_id) {
            return new Promise((resolve, reject) => {
                if (!body.asset_tag) return reject({ message: 'Missing ID' });
                let data = Validate.body(body, 'cameras_create');
                data.realm_id = realm_id;

                Cameras.select('id', { asset_tag: data.asset_tag }).then(result => {
                    if (result[0]) return resolve({ message: 'Invalid ID' });
                    Cameras.insert(data).then(resolve('Camera added.')).catch(reject);
                }).catch(reject);

            });
        },
        read: function(realm_id) {
            return Cameras.select(['id', 'asset_tag', 'ip_address', 'alias'], { realm_id: realm_id });
        },
        update: function(raw, camera_id, realm_id) {
            return new Promise((resolve, reject) => {

                let data = Validate.body(raw, 'cameras_update');

                Cameras.select('id', { asset_tag: data.asset_tag }).then(result => {
                    if (result[0] && result[0].id != camera_id) return resolve('Camera already in use.');

                    Cameras.update(data, { id: camera_id, realm_id: realm_id }).then(resolve('Camera data updated.')).catch(reject);

                }).catch(reject);

            });
        },
        delete: function(camera_id, realm_id) {
            return Cameras.delete({ id: camera_id, realm_id: realm_id })
        }
    };

    return output;

}; //end of module.exports
