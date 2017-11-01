'use strict';
module.exports = function(app) {
    const salt = process.env.SALT;
    const crypto = require('crypto');
    let output = {

        crypt: function(text) {
            return new Promise((resolve, reject) => {
                var cipher = crypto.createCipher('aes256', salt);
                var hash = cipher.update(text, 'utf8', 'base64');
                return resolve(hash += cipher.final('base64'));
            });
        },
        decrypt: function(hash) {
            return new Promise((resolve, reject) => {
                let decipher = crypto.createDecipher('aes256', salt);
                let decrypted_password = decipher.update(hash, 'base64', 'utf8');
                decrypted_password += decipher.final('utf8');
                return resolve(decrypted_password);
            });
        }
    };

    return output;
};
