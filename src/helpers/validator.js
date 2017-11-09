'use strict';

const DEBUG = 0,
    UNAUTHORIZED_CODE = 401,
    FORBIDDEN_CODE = 403,
    ERROR_CODE = 412;

const types = {
    first_name: 'string',
    last_name: 'string',
    email: 'string',
    password: 'string',
    role: 'string',
    name: 'string',
    country: 'string',
    region: 'string',
    city: 'string',
    street: 'string',
    street_number: 'string',
    plate: 'string',
    make: 'string',
    model: 'string',
    realm_id: 'number',
    asset_tag: 'string',
    alias: 'string',
    ip_address: 'string',
    accepted: 'boolean',
};

const exp = {
    users_create: ['first_name', 'last_name', 'email', 'password', 'role', 'created_at', 'created_by'],
    users_update: ['first_name', 'last_name', 'email', 'password', 'role', 'updated_at', 'updated_by'],

    realms_create: ['name', 'country', 'region', 'city', 'street', 'street_number', 'created_at', 'created_by'],
    realms_update: ['name', 'country', 'region', 'city', 'street', 'street_number', 'updated_at', 'updated_by'],

    vehicles_create: ['plate', 'make', 'model', 'realm_id'],
    vehicles_update: ['make', 'model', 'plate'],

    cameras_create: ['asset_tag', 'alias', 'ip_address', 'realm_id'],
    cameras_update: ['asset_tag', 'alias', 'ip_address'],

    logs_create: ['accepted', 'plate', 'file_name', 'camera_id', 'reason', 'realm_id', 'vehicle_id'],

    rules_create: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate', 'realm_id'],
    rules_update: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate'],

};

//=====================================================================================

let Validate = {};
Validate.body = function(before, method) {

    let after = {};
    exp[method].forEach(parameter => {
        if (before[parameter] != undefined /*&& typeof(before[e]) == types[e]*/ ) after[parameter] = before[parameter];
    });

    return after;
};

Validate.object = function(before, expectation) {
    let after = {};

    expectation.forEach(e => {
        if (before[e] != undefined) after[e] = before[e];
    });

    return after;
};

Validate.period = function(input) {
    var month = /^(\d{4})\-(\d{2})$/;
    var year = /^(\d{4})$/;
    var date = /^(\d{4})\-(\d{2})\-(\d{2})$/;

    let match = year.exec(input);
};

module.exports = Validate;

/*
const exp_old = {
    users: {
        create: ['first_name', 'last_name', 'email', 'password', 'role'],
        update: ['first_name', 'last_name', 'email', 'password', 'role'],
    },
    realms: {
        create: ['name', 'country', 'region', 'city', 'street', 'street_number'],
        update: ['name', 'country', 'region', 'city', 'street', 'street_number']
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
        create: ['accepted', 'plate', 'file_name', 'camera_id', 'reason', 'realm_id', 'vehicle_id'],
    },
    rules: {
        create: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id', 'realm_id'],
        update: ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id'],
    }
};
*/
