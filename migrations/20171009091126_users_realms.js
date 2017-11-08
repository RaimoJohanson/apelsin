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
                .insert([{
                    user_id: 2,
                    realm_id: 1,
                    role: 'ADMIN'
                }, {
                    user_id: 2,
                    realm_id: 2,
                    role: 'USER'
                }]);
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
