'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const async = require('async');
const moment = require('moment');
module.exports = function(app) {

    const Validate = require('../helpers/validator');

    const Logs = app.locals.model.logs;
    const Vehicles = app.locals.model.vehicles;

    const output = {
        interactions: {
            thisYear: function(realm_id) {
                return interactionCount(realm_id, moment().format("YYYY"));
            },
            thisMonth: function(realm_id) {
                return interactionCount(realm_id, moment().format("YYYY-MM"));
            },
            today: function(realm_id) {
                return interactionCount(realm_id, moment().format("YYYY-MM-DD"));
            },
        },
        generate: function(realm_id, period) {

            return new Promise((resolve, reject) => {

                let target_period;

                if (period == 'year') target_period = moment().format("YYYY");
                else if (period == 'month') target_period = moment().format("YYYY-MM");
                else if (period == 'today') target_period = moment().format("YYYY-MM-DD");

                let total = new Promise((resolve, reject) => {
                    Logs.find('*', {
                        count: 'id as count',
                        where: [
                            ['created_at', 'like', target_period + '%'],
                            ['realm_id', '=', realm_id],
                        ]
                    }).then(resolve);
                });
                let accepted = new Promise((resolve, reject) => {
                    Logs.find('*', {
                        count: 'id as count',
                        where: [
                            ['created_at', 'like', target_period + '%'],
                            ['realm_id', '=', realm_id],
                            ['accepted', '=', 1],
                        ]
                    }).then(resolve);
                });
                let familiar = new Promise((resolve, reject) => {
                    Logs.find('*', {
                        count: 'id as count',
                        where: [
                            ['created_at', 'like', target_period + '%'],
                            ['realm_id', '=', realm_id],
                        ],
                        whereNotNull: 'vehicle_id'
                    }).then(resolve);
                });
                Promise.all([total, accepted, familiar]).then(values => {

                    let data = {
                        total: values[0][0].count,
                        accepted: values[1][0].count,
                        rejected: values[0][0].count - values[1][0].count,
                        familiar: values[2][0].count,
                        unfamiliar: values[0][0].count - values[2][0].count,
                    };

                    resolve(data);

                }).catch(reject);

            });
        },

    };
    var interactionCount = function(realm_id, period) {

        return new Promise((resolve, reject) => {

            let target_period;

            if (period == 'year') target_period = moment().format("YYYY");
            else if (period == 'month') target_period = moment().format("YYYY-MM");
            else if (period == 'today') target_period = moment().format("YYYY-MM-DD");

            let total = new Promise((resolve, reject) => {
                Logs.find('*', {
                    count: 'id as count',
                    where: [
                        ['created_at', 'like', target_period + '%'],
                        ['realm_id', '=', realm_id],
                    ]
                }).then(resolve);
            });
            let accepted = new Promise((resolve, reject) => {
                Logs.find('*', {
                    count: 'id as count',
                    where: [
                        ['created_at', 'like', target_period + '%'],
                        ['realm_id', '=', realm_id],
                        ['accepted', '=', 1],
                    ]
                }).then(resolve);
            });
            let familiar = new Promise((resolve, reject) => {
                Logs.find('*', {
                    count: 'id as count',
                    where: [
                        ['created_at', 'like', target_period + '%'],
                        ['realm_id', '=', realm_id],
                    ],
                    whereNotNull: 'vehicle_id'
                }).then(resolve);
            });
            Promise.all([total, accepted, familiar]).then(values => {

                let data = {
                    total: values[0][0].count,
                    accepted: values[1][0].count,
                    rejected: values[0][0].count - values[1][0].count,
                    familiar: values[2][0].count,
                    unfamiliar: values[0][0].count - values[2][0].count,
                };

                resolve(data);

            }).catch(reject);

        });
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
