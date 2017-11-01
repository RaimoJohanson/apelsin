'use strict';
const request = require('request');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');

//TEMP ARGS
var url = 'https://api.openalpr.com/v2/recognize';
var secret = '?secret_key=sk_669953c543d5bf83a2960e03';
var args = '&recognize_vehicle=0&country=eu&return_image=0&topn=10';
var pub_temp = '/client/temp/';
//***



module.exports = function(app) {
    const Rules = require('../service/rules')(app);
    const Main = require('../service/main')(app);
    const Logs = require('../service/logs')(app);
    const Authorize = require('../helpers/authorize')(app);
    const errorHandler = require('../helpers/errorhandler');
    const hash = require('../helpers/hash')(app);
    app.get('/apptest', function(req, res) {

        res.render('test.html');

    }); //end of app.get
    app.get('/moment/:tag', Authorize.camera(), function(req, res) {

        console.log('authorize.camera done');
        Rules.checkPlate(req.query.p, req.query.c, 'lambi/path').then(plate_check => {
            console.log('rules.checkPlate done');
            console.log(plate_check);
            Rules.checkPolicy(plate_check).then(result => {

                Logs.create(result).then((response) => {

                    return res.json(result);

                }).catch(errorHandler(res));

            }).catch(errorHandler(res));

        }).catch(errorHandler(res));
    }); //end of app.get
    app.get('/salt', function(req, res) {

        hash.crypt(req.query.text).then(resulto => {
            hash.decrypt(resulto).then(resulta => {

                res.json({ 'crypted': resulto, 'decrypted': resulta });
            });

        });


    }); //end of app.get

    app.get('/imagedeletus', function(req, res) {
        Logs.clean(1, 1).then(results => {
            res.json(results);
        }).catch(errorHandler(res));


    }); //end of app.get

    app.get('/knex', function(req, res) {
        Logs.r3kt(req.query).then(results => {
            res.json(results);
        }).catch(errorHandler(res));


    }); //end of app.get
    app.get('/v1/test/realms/:rid', Authorize.privileges(), function(req, res) {



        res.render('index_new.html');


    }); //end of app.get


    //var upload = multer({ dest: 'src/uploads/' });
    var storage = multer.diskStorage({
        //destination: 'uploads/',
        destination: 'client/temp/',
        filename: function(req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });

    var upload = multer({
        storage: storage
    });

    app.post('/apptest', upload.single('image'), (req, res) => {
        console.log(req.file);




        var payload = {
            image: fs.createReadStream(req.file.path),
        };
        request.post({
            url: url + secret + args,
            formData: payload
        }, (err, resp, data) => {
            if (err) {
                console.log('OpenALPR API Error:', err);
            }
            else if (resp.statusCode !== 200) {
                console.log('OpenALPR API Status:', resp.statusCode);
                //return next(res.statusCode);
            }
            else {
                //console.log(data);
                // res.json(data.results[0].plate);
                let parsed = JSON.parse(data);
                let plate = parsed.results[0].plate;
                let confidence = parsed.results[0].confidence;
                res.render('result.html', {
                    plate: plate,
                    confidence: confidence,
                    subject: req.file.filename

                });
            }
        }); // request



    });



}; //end of module.exports
