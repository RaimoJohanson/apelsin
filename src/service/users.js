'use strict';

module.exports = function(app) {

    const hash = require('../helpers/hash')(app);
    const Validate = require('../helpers/validator');
    const Users = app.locals.model.users;
    const UsersRealms = app.locals.model.users_realms;

    let output = {
        all: function() {
            return Users.find(['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by']);
        },
        create: function(data) {
            return new Promise((resolve, reject) => {
                if (!data.email || !data.password) return reject('Missing <email> and/or <password> parameters');

                let exp = ['first_name', 'last_name', 'email', 'password', 'role', 'created_by'];

                let validated = Validate.object(data, exp);

                validated.password = hash.crypt(validated.password);

                Users.insert(validated).then(resolve).catch(reject);

            });
        },
        read: function(user_id) {
            return Users.select(['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by'], { id: user_id });
        },
        update: function(data, user_id) {
            let exp = ['first_name', 'last_name', 'email', 'password', 'role', 'updated_by'];

            let validated = Validate.object(data, exp);

            if (validated.password) validated.password = hash.crypt(validated.password);

            return Users.update(validated, { id: user_id });
        },
        delete: function(user_id) {
            return Users.delete({ id: user_id });
        },
        realm: {
            all: function(realm_id) {

                return Users.find(['users.id as id', 'first_name', 'last_name', 'email', /*'users.role as account_role', 'created_at', 'updated_at', 'created_by', 'updated_by',*/ 'users_realms.role as realm_role'], {
                    related: [{
                        target_column: 'user_id',
                        target_table: 'users_realms',
                        column: 'id'
                    }],
                    whereRaw: 'users_realms.realm_id=' + realm_id

                });
            },
            find: function(realm_id, user_id) {
                return Users.find(['users.id as id', 'first_name', 'last_name', 'email', /*'users.role as account_role', 'created_at', 'updated_at', 'created_by', 'updated_by',*/ 'users_realms.role as realm_role'], {
                    related: [{
                        target_column: 'user_id',
                        target_table: 'users_realms',
                        column: 'id'
                    }],
                    whereRaw: 'users_realms.realm_id=' + realm_id + ' and users.id=' + user_id
                });
            },
            create: function(data, realm_id) {
                return new Promise((resolve, reject) => { resolve('DEV: Account created and realm added.') });
                /*
                output.create(data).then(new_user => {
                    UsersRealms.insert({ user_id: new_user, realm_id: realm_id, role: data.role }).then(() => {
                        return 'Account created and realm added.';
                    })
                })
                */
            },
            read: function() {

            },
            update: function() {},
            delete: function(user_id, realm_id) {
                return new Promise((resolve, reject) => { resolve('realm relation to account deleted.') });
            }
        }
    };

    return output;

}; //end of module.exports
