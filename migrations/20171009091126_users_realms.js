exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users_realms', function(table) {
            table.increments('id').primary().unique();
            table.integer('user_id').unsigned();
            table.foreign('user_id').onDelete('CASCADE').references('users.id');
            table.integer('realm_id').unsigned();
            table.foreign('realm_id').onDelete('CASCADE').references('realms.id');
            table.enum('role', ['ADMIN', 'USER']);
        })
        .then(() => {

            return knex('users_realms')
                .insert(dummy);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('users_realms');
};
/*
USERS_REALMS
ID
user_id
realm_id
role                =>        table.enum('role', ['ADMIN', 'USER']);
*/

var dummy = [{
        user_id: 2,
        realm_id: 1,
        role: 'ADMIN'
    }, {
        user_id: 2,
        realm_id: 2,
        role: 'USER'
    }, {
        user_id: 1,
        realm_id: 1,
        role: 'USER'
    }, {
        user_id: 1,
        realm_id: 2,
        role: 'ADMIN'
    },
    {
        user_id: 3,
        realm_id: 1,
        role: 'USER'
    }, {
        user_id: 4,
        realm_id: 3,
        role: 'ADMIN'
    },
    {
        user_id: 5,
        realm_id: 4,
        role: 'USER'
    }, {
        user_id: 6,
        realm_id: 4,
        role: 'ADMIN'
    },
    {
        user_id: 6,
        realm_id: 5,
        role: 'USER'
    }, {
        user_id: 2,
        realm_id: 5,
        role: 'ADMIN'
    }
]
