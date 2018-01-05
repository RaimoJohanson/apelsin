'use strict';
var request = require('request');
var fs = require('fs');
module.exports = function(app) {



    var url = 'https://api.openalpr.com/v2/recognize';
    var secret = '?secret_key=sk_669953c543d5bf83a2960e03';
    var args = '&recognize_vehicle=0&country=eu&return_image=0&topn=10';

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

                        //TODO: check for multiple plates. determine one plate that is more on focus relative to the image's dimensions

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
/*
{
"uuid":"",
"data_type":"alpr_results",
"epoch_time":1515145377003,
"processing_time":{
"plates":210.36705017089844,
"total":214.4079999998212
},
"img_height":600,
"img_width":900,
"results":[
{
"plate":"146MHJ",
"confidence":94.26607513427734,
"region_confidence":0,
"vehicle_region":{
"y":317,
"x":308,
"height":249,
"width":249
},
"region":"",
"plate_index":0,
"processing_time_ms":192.87118530273438,
"candidates":[],
"coordinates":[
{
"y":475,
"x":398
},
{
"y":472,
"x":468
},
{
"y":490,
"x":468
},
{
"y":493,
"x":399
}
],
"matches_template":0,
"requested_topn":10
},
{
"plate":"697BAV",
"confidence":94.98760223388672,
"region_confidence":0,
"vehicle_region":{
"y":305,
"x":659,
"height":241,
"width":241
},
"region":"",
"plate_index":1,
"processing_time_ms":192.87118530273438,
"candidates":[
{
"matches_template":0,
"plate":"697BAV",
"confidence":94.98760223388672
}
],
"coordinates":[
{
"y":459,
"x":746
},
{
"y":460,
"x":835
},
{
"y":479,
"x":834
},
{
"y":477,
"x":745
}
],
"matches_template":0,
"requested_topn":10
}
],
"credits_monthly_used":17,
"version":2,
"credits_monthly_total":2000,
"error":false,
"regions_of_interest":[
],
"credit_cost":1
}

*/
