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
                //return new Promise((resolve, reject) => { resolve('DEV: Account created and realm added.') });
                return new Promise((resolve, reject) => {
                    data.realm_role = data.role;
                    data.role = 'CLIENT';

                    output.create(data).then(new_user => {

                        UsersRealms.insert({ user_id: new_user[0].id, realm_id: realm_id, role: data.realm_role }).then(() => {
                            return 'Account created and realm added.';
                        })
                    })
                });
            },
            update: function(data, realm_id, user_id) {
                return new Promise((resolve, reject) => {
                    output.update(data, user_id).then(qq => {
                        if (data.role) {
                            data.realm_role = data.role;
                            data.role = 'CLIENT';
                        }
                        UsersRealms.update(data, { user_id: user_id, realm_id: realm_id }).then(() => {
                            return 'Account created and realm added.';
                        })
                    })
                });
            },
            delete: function(user_id, realm_id) {
                return new Promise((resolve, reject) => {

                    UsersRealms.delete({ user_id: user_id, realm_id: realm_id }).then(() => {
                        return 'Realm relation deleted.';
                    })
                });
            }
        }
    };

    return output;

}; //end of module.exports
