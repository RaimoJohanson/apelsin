'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const POLICY_DECISION = 'Policy decision';
const DEFAULT_REASON = 'Default decision';
module.exports = function(app) {
    let async = require('async');
    let moment = require('moment');

    let Validate = require('../helpers/validator');

    let Vehicles = app.locals.model.vehicles;
    let Cameras = app.locals.model.cameras;
    let Rules = app.locals.model.rules;

    let output = {

        all: function(realm_id) {
            return Rules.selectWhere('*', { realm_id: realm_id });
        },
        create: function(data, realm_id) {
            data.realm_id = realm_id;
            let exp = ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id', 'realm_id'];
            return Rules.insert(Validate.object(data, exp));
        },
        read: function(realm_id, rule_id) {
            return Rules.selectWhere('*', { realm_id: realm_id, id: rule_id });
        },
        update: function(data, realm_id, rule_id) {
            let exp = ['accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id'];
            return Rules.update(Validate.object(data, exp), { realm_id: realm_id, id: rule_id });
        },
        delete: function(realm_id, rule_id) {
            return Rules.delete({ realm_id: realm_id, id: rule_id });
        },
        deleteVehicle: function(realm_id, vehicle_id) {
            return Rules.delete({ realm_id: realm_id, vehicle_id: vehicle_id });
        },
        checkPlate: function(plate, asset_tag, file_path) {
            return new Promise((resolve, reject) => {

                Cameras.selectWhere('*', { asset_tag: asset_tag }).then(camera => {

                    Vehicles.selectWhere('*', { plate: plate, realm_id: camera[0].realm_id }).then(vehicle => {
                        let decide = {
                            plate: plate,
                            camera_id: camera[0].id,
                            realm_id: camera[0].realm_id,
                            file_path: file_path
                        };

                        if (!vehicle[0]) {
                            decide.accepted = 0;
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
                if (data.accepted === 0) return resolve(data);
                let today = {
                    weekday: moment().day(),
                    time: moment().format("HH:mm:ss"),
                    date: moment().format("YYYY-MM-DD")
                };
                console.log(today);

                //MAKE IT SELECTABLE?
                const default_accepted = 1;

                //NEXT ITERATION: remove vehicle_id from query. Rule could apply to all vehicles!
                //ALSO: make rule checking process modular for more flexibility. (rule hierarhy implementation) 

                Rules.selectWhere('*', { realm_id: data.realm_id, vehicle_id: data.vehicle_id }).then(rules => {
                    if (!rules.length) {
                        console.log('No rules');
                        data.reason = DEFAULT_REASON;
                        data.accepted = default_accepted;
                        return resolve(data);
                    }

                    let days = {
                        1: 'mon',
                        2: 'tue',
                        3: 'wed',
                        4: 'thu',
                        5: 'fri',
                        6: 'sat',
                        7: 'sun'
                    };

                    async.eachSeries(rules, (rule, cb) => {

                        //If there is a rule that allows this vehicle, then by default this vehicle is not allowed.
                        if (rule.accepted === 1) default_accepted = 0;


                        //===============================================================================
                        let check_weekday = (columns) => {
                            return new Promise((resolve) => {
                                let counter = columns.length;
                                columns.forEach(column => {
                                    if (rule[column] == 1) return resolve(true);
                                    counter--;
                                    if (counter === 0) return resolve(false);

                                });
                            });

                        };
                        //= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
                        let check_period = (arg) => {
                            switch (arg) {
                                case 'begin_date':
                                    if (rule.begin_date <= today.date) return true;
                                    else return false;
                                case 'end_date':
                                    if (rule.end_date >= today.date) return true;
                                    else return false;
                                case 'begin_time':
                                    if (rule.begin_time <= today.time) return true;
                                    else return false;
                                case 'end_time':
                                    if (rule.end_time >= today.time) return true;
                                    else return false;
                                default:
                                    //error
                                    console.log('Rules time period switch case failed...');
                                    return false;
                            }
                        }; // end of check_period()
                        //= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

                        let restrictions = (atbs) => {
                            return new Promise((resolve) => {
                                let counter = atbs.length;
                                atbs.forEach(attr => {
                                    if (rule[attr]) {
                                        if (!check_period(attr)) {
                                            console.log('Rule ID: %s = %s:%s - Rule attribute does not apply.', rule.id, attr, rule[attr]);
                                            counter--;
                                            return resolve(false);
                                        }
                                        else {
                                            console.log('Rule ID: %s = %s:%s - Rule attribute applies.', rule.id, attr, rule[attr]);
                                            counter--;
                                            if (counter === 0) return resolve(true);
                                        }
                                    }
                                    else {
                                        console.log('Rule ID: %s = %s: none - Skipping attribute...', rule.id, attr);
                                        counter--;
                                        if (counter === 0) return resolve(true);
                                    }
                                });
                            });
                        };
                        //===============================================================================
                        let days_of_week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                        let attributes = ['begin_date', 'end_date', 'begin_time', 'end_time'];

                        console.log('Checking rule date and time restrictions... rule ID: %s', rule.id);

                        restrictions(attributes).then(restriction => {
                            if (restriction) {
                                check_weekday(days_of_week).then(weekday_specified => {
                                    if (weekday_specified) {
                                        if (rule[days[today.weekday]]) {
                                            console.log('Rule ID: %s = Rule applies today - %s', rule.id, days[today.weekday]);
                                            data.reason = POLICY_DECISION;
                                            data.rule_id = rule.id;
                                            data.accepted = rule.accepted;
                                            return resolve(data);
                                        }
                                        else {
                                            console.log('Rule ID: %s = Rule does not apply today.', rule.id);
                                            return cb();
                                        }
                                    }
                                    else {
                                        console.log('Rule ID: %s... Day of week is not specified. Rule applies.', rule.id);
                                        data.reason = POLICY_DECISION;
                                        data.rule_id = rule.id;
                                        data.accepted = rule.accepted;
                                        return resolve(data);
                                    }
                                });
                            }
                            else {
                                console.log('Rule ID: %s - Rule timeframe not applicable.', rule.id);
                                return cb();
                            }

                        });

                    }, () => {
                        console.log('No rules apply. Default accepted: %s', default_accepted);
                        data.reason = DEFAULT_REASON;
                        data.accepted = default_accepted;
                        resolve(data);
                    });

                }).catch(reject); //Rules
            });
        }, //validate
    };

    return output;

}; //end of module.exports
