exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary().unique();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('email');
            table.string('password');
            table.enum('role', ['SUPER', 'CLIENT', 'DEV']);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at');
            table.integer('created_by').unsigned().references('users.id');
            table.integer('updated_by').unsigned().references('users.id');
        })
        .then(() => {

            return knex('users')
                .insert([{
                    first_name: 'Sten',
                    last_name: 'Saar',
                    email: 'sten',
                    password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
                    role: 'SUPER'
                }, {
                    first_name: 'Raimo',
                    last_name: 'Johanson',
                    email: 'raimo',
                    password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
                    role: 'DEV'
                }, {
                    first_name: 'Test',
                    last_name: 'Client',
                    email: 'test@client.com',
                    password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
                    role: 'CLIENT'
                }]);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('users');
};
