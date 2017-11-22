'use strict';
var request = require('request');
module.exports = function(app) {
    let async = require('async');
    const fs = require('fs');

    var url = 'https://api.openalpr.com/v2/recognize';
    var secret = '?secret_key=sk_669953c543d5bf83a2960e03';
    var args = '&recognize_vehicle=0&country=eu&return_image=0&topn=10';
    var pub_temp = '/client/temp/';

    const Realms = app.locals.model.realms;
    const UsersRealms = app.locals.model.users_realms;
    const Vehicles = app.locals.model.vehicles;


    var output = {

        connect: function(file_path) {
            return new Promise((resolve, reject) => {
                request.post({
                    url: url + secret + args,
                    formData: {
                        image: fs.createReadStream(file_path),
                    }
                }, (err, resp, data) => {
                    if (err) {
                        console.log('OpenALPR error:', err);
                        return reject(err);
                    }
                    else if (resp.statusCode !== 200) {
                        console.log('OpenALPR status:', resp.statusCode);
                        return reject(resp.statusCode);
                    }
                    else {
                        console.log('openalpr connect done');
                        console.log(data);
                        let parsed = JSON.parse(data);
                        if (!parsed.results[0]) return resolve({
                            plate: null,
                            reason: 'Licence plate not detected'
                        });
                        else if (parsed.results[0].plate) {
                            let plate = parsed.results[0].plate;
                            //let confidence = parsed.results[0].confidence;
                            let formatted_data = {
                                plate: plate,
                                //confidence: confidence
                            };
                            return resolve(formatted_data);
                        }
                        else return resolve({
                            plate: null,
                            reason: 'Licence plate not detected'
                        });

                    }
                }); //request

            }); // promise
        }
    };

    return output;

}; //end of module.exports
