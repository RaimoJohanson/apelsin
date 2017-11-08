'use strict';
const async = require('async');
module.exports = function(app) {

    const Validate = require('../helpers/validator');

    const Realms = app.locals.model.realms;

    let output = {

        create: function(data) {
            return Realms.insert(Validate.body(data, 'realms_insert'));
        },
        read: function(realm_id) {
            return Realms.select('*', { id: realm_id });
        },
        update: function(data, realm_id) {
            return Realms.update(Validate.body(data, 'realms_update'), { id: realm_id });
        },
        delete: function(realm_id) {
            return Realms.delete({ id: realm_id });
        }

    };

    return output;

}; //end of module.exports
