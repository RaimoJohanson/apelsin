'use strict';

const DEBUG = 0,
    UNAUTHORIZED_CODE = 401,
    FORBIDDEN_CODE = 403,
    ERROR_CODE = 412;

//make it so that it can be accessed from services.
let exp = {
    users: {
        create: ['first_name', 'last_name', 'email', 'password', 'role', 'created_by'],
        update: ['first_name', 'last_name', 'email', 'password', 'role', 'updated_by'],
    },
    vehicles: {
        create: ['plate', 'make', 'model', 'realm_id'],
        update: ['make', 'model', 'plate'],
    },
    cameras: {
        create: ['asset_tag', 'alias', 'ip_address', 'realm_id'],
        update: ['asset_tag', 'alias', 'ip_address'],
    },
    logs: {
        create: ['accepted', 'plate', 'file_path', 'camera_id', 'reason', 'realm_id', 'vehicle_id'],
    },
    rules: {
        create: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id', 'realm_id'],
        update: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id'],
    }
};
//NEXT ITERATION: also data types must be consistent
let types = {
    first_name: 'string',
    email: 'string',
    password: 'string',
    accepted: 'boolean',
    realm_id: 'integer'
};
//=====================================================================================

let Validate = {};
Validate.body = function(before, opts) {
    let after = {};
    exp[opts.service][opts.method].forEach(e => {
        if (before[e] != undefined) after[e] = before[e];
    });

    return after;
}; //validate.body

Validate.object = function(before, expectation) {
    let after = {};

    expectation.forEach(e => {
        if (before[e] != null) after[e] = before[e];
    });

    return after;
}; //validate.body

module.exports = Validate;
