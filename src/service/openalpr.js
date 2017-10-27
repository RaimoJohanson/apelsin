'use strict';
var request = require('request');
module.exports = function(app) {
    let async = require('async');
    const fs = require('fs');

    var url = 'https://api.openalpr.com/v2/recognize';
    var secret = '?secret_key=sk_669953c543d5bf83a2960e03';
    var args = '&recognize_vehicle=0&country=eu&return_image=0&topn=10';
    var pub_temp = '/client/temp/';

    let Realms = app.locals.model.realms;
    let UsersRealms = app.locals.model.users_realms;
    let Vehicles = app.locals.model.vehicles;


    let output = {

        connect: function(file_path) {
            return new Promise((resolve, reject) => {
                var payload = {
                    image: fs.createReadStream(file_path),
                };
                request.post({
                    url: url + secret + args,
                    formData: payload
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
                        if (parsed.results[0].plate) {
                            let plate = parsed.results[0].plate;
                            //let confidence = parsed.results[0].confidence;
                            let formatted_data = {
                                plate: plate,
                                //confidence: confidence
                            };
                            resolve(formatted_data);
                        }
                        else reject('Image could not be processed. Error: 0178');

                    }
                }); //request

            }); // promise
        }
    };

    return output;

}; //end of module.exports
