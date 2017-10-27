'use strict';

module.exports = function(app) {

    const hash = require('../helpers/hash')(app);
    const Validate = require('../helpers/validator');
    const Users = app.locals.model.users;

    let output = {
        all: function() {
            return Users.select(['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by']);
        },
        create: function(data) {
            return new Promise((resolve, reject) => {
                if (!data.email || !data.password) return reject('Missing <email> and/or <password> parameters');

                let exp = ['first_name', 'last_name', 'email', 'password', 'role', 'created_by'];
                let validated = Validate.object(data, exp);

                hash.crypt(validated.password).then(hashed => {
                    validated.password = hashed;
                    Users.insert(validated).then(resolve).catch(reject);
                });
            });
        },
        read: function(user_id) {
            return Users.selectWhere(['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by'], { id: user_id });
        },
        update: function(data, user_id) {
            let exp = ['first_name', 'last_name', 'email', 'password', 'role', 'updated_by'];
            let validated = Validate.object(data, exp);

            if (!validated.password) return Users.update(validated, { id: user_id });

            hash.crypt(validated.password).then(hashed => {
                validated.password = hashed;
                return Users.update(validated, { id: user_id });
            });


        },
        delete: function(user_id) {
            return Users.delete({ id: user_id });
        },
    };

    return output;

}; //end of module.exports
