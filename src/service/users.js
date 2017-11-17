'use strict';

module.exports = function(app) {

    const hash = require('../helpers/hash')(app);
    const Validate = require('../helpers/validator');
    const Users = app.locals.model.users;
    const UsersRealms = app.locals.model.users_realms;

    let output = {
        all: function(query = {}) {
            let opts = {};
            let cols = ['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by'];
            if (query.email) {
                cols = ['id', 'first_name', 'last_name', 'email'];
                opts.where = { email: query.email };
            }
            return Users.find(cols, opts);
        },
        create: function(data) {
            return new Promise((resolve, reject) => {
                if (!data.email || !data.password) return reject('Missing <email> and/or <password> parameters');

                let exp = ['first_name', 'last_name', 'email', 'password', 'created_by'];

                let validated = Validate.object(data, exp);

                Users.find(['id'], { where: { email: validated.email } }).then(results => {
                    if (results[0]) return reject('Email address already registered');

                    validated.role = 'CLIENT';
                    validated.password = hash.crypt(validated.password);

                    Users.insert(validated).then(resolve).catch(reject);

                }).catch(reject);

            });
        },
        read: function(user_id) {
            return Users.select(['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'created_by', 'updated_by'], { id: user_id });
        },
        update: function(data, user_id) {
            let exp = ['first_name', 'last_name', 'email', 'password', 'updated_by'];

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
                return new Promise((resolve, reject) => {

                    if (!data.user_id) return reject({ message: 'user_id parameter missing' });

                    UsersRealms.insert({ user_id: data.user_id, realm_id: realm_id, role: data.role }).then(() => {
                        return resolve({ message: 'Added.' });
                    }).catch(reject);


                });
            },
            update: function(data, realm_id, user_id) {
                return new Promise((resolve, reject) => {

                    UsersRealms.update(data, { user_id: user_id, realm_id: realm_id }).then(() => {
                        return resolve({ message: 'Updated.' });
                    }).catch(reject);
                });
            },
            delete: function(user_id, realm_id) {
                return new Promise((resolve, reject) => {

                    UsersRealms.delete({ user_id: user_id, realm_id: realm_id }).then(() => {
                        return resolve({ message: 'Deleted.' });
                    })
                });
            }
        }
    };

    return output;

}; //end of module.exports
