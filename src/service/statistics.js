'use strict';
const INVALID_CAMERA = 'Invalid camera asset tag';
const async = require('async');
const moment = require('moment');
module.exports = function(app) {

    let Validate = require('../helpers/validator');

    let Logs = app.locals.model.logs;
    let Rules = app.locals.model.rules;
    let Cameras = app.locals.model.cameras;

    let output = {

        year: function(realm_id, query) {
            return new Promise((resolve, reject) => {
                let output = {
                    summary: {
                        total: 0,
                        unrecognized: 0,
                        recognized: 0,
                        accepted: 0,
                        rejected: 0,
                    },
                    plates: {},
                    rush_hour: {}
                };

                for (let i = 0; i <= 23; i++) {
                    i < 10 ? output.rush_hour['0' + i] = 0 : output.rush_hour[i] = 0;
                }

                let today = {
                    weekday: moment().day(),
                    time: moment().format("HH:mm:ss"),
                    date: moment().format("YYYY-MM-DD"),
                    year: moment().format("YYYY")
                };
                let where = 'realm_id = ' + realm_id;
                if (query.year) where += ' and created_at <= "' + query.year + '-12-31" and created_at >= "' + query.year + '-01-01"';
                Logs.raw('*', where).then(logs => {
                    let os = output.summary;
                    let op = output.plates;
                    let orh = output.rush_hour;
                    os.total = logs.length;

                    async.each(logs, (log, cb) => {

                        log.accepted ? os.accepted += 1 : os.rejected += 1;
                        log.vehicle_id ? os.recognized += 1 : os.unrecognized += 1;

                        if (log.plate) op[log.plate] ? op[log.plate] += 1 : op[log.plate] = 1;

                        orh[moment(log.created_at).format("HH")] ? orh[moment(log.created_at).format("HH")] += 1 : orh[moment(log.created_at).format("HH")] = 1;

                        cb();


                    }, () => {

                        resolve(output);
                    })

                });
            });
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
