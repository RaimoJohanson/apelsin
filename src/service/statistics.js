'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const async = require('async');
const moment = require('moment');
module.exports = function(app) {

    const Validate = require('../helpers/validator');

    const Logs = app.locals.model.logs;
    const Vehicles = app.locals.model.vehicles;

    const output = {

        generate: function(realm_id, opts) {

            return new Promise((resolve, reject) => {
                let output = {
                    interactions: {
                        total: 0,
                        familiar: 0,
                        unfamiliar: 0,
                        accepted: 0,
                        rejected: 0,
                    },
                    vehicles: [],
                    rush_hour: {}
                };
                let vehicle_fq = {};

                for (let i = 0; i <= 23; i++) {
                    i < 10 ? output.rush_hour['0' + i] = 0 : output.rush_hour[i] = 0;
                }

                let today = {
                    weekday: moment().day(),
                    time: moment().format("HH:mm:ss"),
                    date: moment().format("YYYY-MM-DD"),
                    year: moment().format("YYYY")
                };
                let q = {
                    where: { realm_id: realm_id }
                }
                if (opts.year) q.whereRaw = 'created_at <= "' + opts.year + '-12-31" and created_at >= "' + opts.year + '-01-01"';
                else if (opts.month) q.whereRaw = 'created_at <= "' + opts.month + '-31" and created_at >= "' + opts.month + '-01"';

                Logs.find('*', q).then(logs => {
                    if (!logs.length) return reject({ status_code: 404, message: 'Nothing found' })
                    let os = output.interactions;
                    let op = output.plates;
                    os.total = logs.length;

                    async.each(logs, (log, cb) => {

                        log.accepted ? os.accepted += 1 : os.rejected += 1;
                        log.vehicle_id ? os.familiar += 1 : os.unfamiliar += 1;

                        output.rush_hour[moment(log.created_at).format("HH")] ? output.rush_hour[moment(log.created_at).format("HH")] += 1 : output.rush_hour[moment(log.created_at).format("HH")] = 1;
                        if (!log.vehicle_id) return cb();

                        vehicle_fq[log.vehicle_id] ? vehicle_fq[log.vehicle_id] += 1 : vehicle_fq[log.vehicle_id] = 1;

                        cb();
                    }, () => {

                        async.each(Object.keys(vehicle_fq), (vehicle_id, cb) => {
                            Vehicles.select(['id', 'plate', 'make', 'model'], { id: vehicle_id }).then(result => {
                                result[0].interactions = vehicle_fq[vehicle_id];
                                output.vehicles.push(result[0]);
                                cb();
                            })

                        }, () => {
                            resolve(output);
                        })

                    })
                });
            });
        },
        generate2: function(realm_id, opts) {

            return this.month(realm_id, opts.month);
        },
        month: function(realm_id, month) {
            return new Promise((resolve, reject) => {
                let opts = {
                    where: [
                        ['created_at', '<=', month + '-31'],
                        ['created_at', '>=', month + '-01'],
                        ['realm_id', '=', realm_id]
                    ],
                };
                Logs.find(['accepted', 'vehicle_id'], opts).then(logs => {
                    let interactions = {
                        total: logs.length,
                        accepted: 0,
                        rejected: 0,
                        familiar: 0,
                        unfamiliar: 0
                    };
                    async.each(logs, (log, cb) => {

                        log.accepted ? interactions.accepted += 1 : interactions.rejected += 1;
                        log.vehicle_id ? interactions.familiar += 1 : interactions.unfamiliar += 1;

                        return cb();
                    }, () => {

                        return resolve(interactions);

                    })

                }).catch(reject);

            }); //promise
        }

    };

    return output;

}; //end of module.exports
/*
Statistika:

Mida tahame näha:

Kasutaja vaates (account. kas siis admin või user)
1. Mis auto, kui sagedasti käib
2. palju üldse käiakse läbi 
3. tipptund
4. accepted/mitte
5. 

- Aasta lõikes
- Kuu lõikes
- 

!!! Kui accepted = true. kustuta fotosüüdistus ära, ruumi säästmiseks _>>> kui see juhtus ~10 päringut tagasi.

Kui tuleb uus kirje auto kohta (vehicle_id), siis ühtlasi checkigu kas on midagi kustutada ka.
*/
