'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const POLICY_DECISION = 'Policy decision';
const DEFAULT_REASON = 'Default decision';
const UNRECOGNIZED = 'Licence plate not detected';
module.exports = function(app) {
    let async = require('async');
    let moment = require('moment');

    let Validate = require('../helpers/validator');
    let CheckRule = require('../helpers/check_rule');

    let Vehicles = app.locals.model.vehicles;
    let Cameras = app.locals.model.cameras;
    let Rules = app.locals.model.rules;

    let output = {

        all: function(realm_id) {
            return Rules.select(['id', 'accepted', 'days_of_week', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate'], { realm_id: realm_id });
        },
        create: function(data, realm_id) {
            data.realm_id = realm_id;
            let exp = ['accepted', 'days_of_week', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate', 'realm_id'];
            return Rules.insert(Validate.object(data, exp));
        },
        read: function(realm_id, rule_id) {
            return Rules.select(['accepted', 'days_of_week', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate'], { realm_id: realm_id, id: rule_id });
        },
        update: function(data, realm_id, rule_id) {
            let exp = ['accepted', 'days_of_week', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate'];
            return Rules.update(Validate.object(data, exp), { realm_id: realm_id, id: rule_id });
        },
        delete: function(realm_id, rule_id) {
            return Rules.delete({ realm_id: realm_id, id: rule_id });
        },
        checkPlate: function(plate, asset_tag, file_name) {
            return new Promise((resolve, reject) => {

                Cameras.select('*', { asset_tag: asset_tag }).then(camera => {

                    Vehicles.select('*', { plate: plate, realm_id: camera[0].realm_id }).then(vehicle => {

                        let decide = {
                            plate: plate,
                            camera_id: camera[0].id,
                            realm_id: camera[0].realm_id,
                            file_name: file_name
                        };

                        if (!vehicle[0]) {
                            //decide.accepted = 0;
                            decide.reason = 'Licence plate not in database';
                            return resolve(decide);
                        }
                        else {
                            decide.vehicle_id = vehicle[0].id;
                            return resolve(decide);
                        }
                    }).catch(reject);

                }).catch(reject);
            });
        }, //checkPlate

        checkPolicy: function(data) {
            return new Promise((resolve, reject) => {
                if (!data.plate) {
                    data.plate = "N/A";
                    data.reason = UNRECOGNIZED;
                    data.accepted = 0;
                    return resolve(data);
                }

                let default_accepted = 1;
                //If vehicle not in database, check for rule anyway
                if (!data.vehicle_id) default_accepted = 0;
                //NEXT ITERATION: remove vehicle_id from query. Rule could apply to all vehicles!?

                let rule_exists = Rules.select('*', { realm_id: data.realm_id, plate: data.plate });
                let time_of_day = Rules.find('*', { where: { plate: data.plate, realm_id: data.realm_id }, whereNotNull: ['begin_time', 'end_time'] });
                let weekday = Rules.find('*', { where: { plate: data.plate, realm_id: data.realm_id }, whereNotNull: ['days_of_week'] });
                let period = Rules.find('*', { where: { plate: data.plate, realm_id: data.realm_id }, whereNotNull: ['begin_date', 'end_date'] });


                Promise.all([time_of_day, weekday, period, rule_exists]).then(values => {
                    if (!values[3].length) {
                        console.log('No rules');
                        if (!data.reason) data.reason = DEFAULT_REASON;
                        data.accepted = default_accepted;
                        return resolve(data);
                    }
                    async.eachSeries(values, (value, cb) => {
                        if (value.length) {
                            CheckRule.params(value).then(rule => {
                                if (rule) {
                                    console.log('something came back from checking: rule ID:', rule.id);
                                    data.reason = POLICY_DECISION;
                                    data.accepted = rule.accepted;
                                    return resolve(data);
                                }
                                else cb();
                            });
                        }
                        else cb();
                    }, () => {
                        console.log('No suitable rules');
                        if (!data.reason) data.reason = DEFAULT_REASON;
                        data.accepted = default_accepted;
                        return resolve(data);
                    });
                }).catch(reject);
            });
        }, //validate
    };

    return output;

}; //end of module.exports
