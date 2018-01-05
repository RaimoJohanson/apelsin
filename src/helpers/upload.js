'use strict';

const multer = require('multer');
module.exports = function(app) {

    var storage = multer.diskStorage({
        destination: 'src/archive/',
        filename: function(req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });

    var upload = multer({
        storage: storage
    });


    var Resource = {};
    Resource.image = upload.single('image');

    return Resource;
};
