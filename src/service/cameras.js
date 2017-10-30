'use strict';

module.exports = function(app) {

    let Cameras = app.locals.model.cameras;
    let Validate = require('../helpers/validator');

    let output = {
        create: function(body, realm_id) {
            return new Promise((resolve, reject) => {
                body.realm_id = realm_id;
                let exp = ['asset_tag', 'alias', 'ip_address', 'realm_id'];
                let data = Validate.object(body, exp);
                //Check if vehicle exists
                Cameras.selectWhere('id', { asset_tag: data.asset_tag, realm_id: data.realm_id }).then(result => {
                    if (result[0]) return resolve('Camera already exists');
                    Cameras.insert(data).then(resolve('Camera added.')).catch(reject);
                }).catch(reject);

            });
        },
        read: function(realm_id) {

            return new Promise((resolve, reject) => {
                Cameras.selectWhere(['id', 'asset_tag', 'ip_address', 'alias'], { realm_id: realm_id }).then(result => {
                    resolve(result);
                }).catch(reject);

            });
        },
        update: function(body, vehicle_id, realm_id) {

            return new Promise((resolve, reject) => {
                let exp = ['asset_tag', 'alias', 'ip_address'];
                Cameras.update(Validate.object(body, exp), { id: vehicle_id, realm_id: realm_id }).then(resolve).catch(reject);
            });
        },
        delete: function(camera_id, realm_id) {

            return new Promise((resolve, reject) => {
                let where = { id: camera_id, realm_id: realm_id };
                Cameras.delete(where).then(resolve).catch(reject);

            });
        }
    };

    return output;

}; //end of module.exports
