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

                return Users.find(['users.id as id', 'first_name', 'last_name', 'email', /*'users.role as account_role', 'created_at', 'updated_at', 'created_by', 'updated_by',*/ 'users_realms.role as role'], {
                    related: [{
                        target_column: 'user_id',
                        target_table: 'users_realms',
                        column: 'id'
                    }],
                    whereRaw: 'users_realms.realm_id=' + realm_id

                });
            },
            find: function(realm_id, user_id) {
                return Users.find(['users.id as id', 'first_name', 'last_name', 'email', 'users_realms.role as role'], {
                    related: [{
                        target_column: 'user_id',
                        target_table: 'users_realms',
                        column: 'id'
                    }],
                    whereRaw: 'users_realms.realm_id=' + realm_id + ' and users.id=' + user_id
                });
            },
            create: function(data, realm_id, actor) {
                return new Promise((resolve, reject) => {
                    if (!data.user_id) return reject({ message: 'user_id parameter missing' });
                    if (data.role == 'OWNER' || data.role == 'owner') return reject({ message: 'Owner privileges must be granted by another owner after the account is added' });

                    UsersRealms.select('*', { user_id: data.user_id, realm_id: realm_id }).then(check => {
                        if (check[0]) return reject({ message: 'Account already added!' });

                        UsersRealms.insert({ user_id: data.user_id, realm_id: realm_id, role: data.role, created_by: data.created_by }).then(() => {
                            return resolve({ message: 'Account added!' });
                        }).catch(reject);
                    }).catch(reject);
                });
            },
            update: function(data, realm_id, user_id, actor) {
                return new Promise((resolve, reject) => {
                    if (actor._realms_[1] != 'OWNER' && data.role == 'OWNER' || data.role == 'owner') return reject({ message: 'Owner privileges must be granted by another owner' });
                    UsersRealms.select('*', { user_id: user_id, realm_id: realm_id }).then(check => {
                        if (!check.length) reject({ message: 'Account not found.' });
                        if (check[0] && actor.id != user_id && actor._realms_[1] != 'OWNER') {
                            if (check[0].role == 'OWNER') return reject({ message: 'Cannot manage owner' });
                            if (check[0].role == 'ADMIN') return reject({ message: 'Cannot manage other admins' });
                        }


                        UsersRealms.update(data, { user_id: user_id, realm_id: realm_id }).then(() => {
                            return resolve({ message: 'Account role updated!' });
                        }).catch(reject);
                    }).catch(reject);

                });
            },
            delete: function(realm_id, user_id, actor) {
                return new Promise((resolve, reject) => {
                    UsersRealms.select('*', { user_id: user_id, realm_id: realm_id }).then(check => {
                        if (check[0] && actor.id != user_id && actor._realms_[1] != 'OWNER') {
                            if (check[0].role == 'OWNER') return reject({ message: 'Cannot remove owner' });
                            if (check[0].role == 'ADMIN') return reject({ message: 'Cannot remove other admins' });
                        }

                        UsersRealms.delete({ user_id: user_id, realm_id: realm_id }).then(() => {
                            return resolve({ message: 'Account removed' });
                        }).catch(reject);
                    }).catch(reject);
                });
            }
        }
    };

    return output;

}; //end of module.exports
