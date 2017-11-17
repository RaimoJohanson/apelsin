exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary().unique();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('email');
            table.string('password');
            table.enum('role', ['SUPER', 'CLIENT', 'DEV']);
            //table.boolean('activated').defaultTo(false);
            table.integer('created_by').unsigned().references('users.id');
            table.integer('updated_by').unsigned().references('users.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at');
        })
        .then(() => {

            return knex('users')
                .insert(dummy);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('users');
};
var dummy = [{
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
        first_name: 'Test1',
        last_name: 'Client',
        email: 'test1@client',
        password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
        role: 'CLIENT'
    },
    {
        first_name: 'Test2',
        last_name: 'Client',
        email: 'test2@client',
        password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
        role: 'CLIENT'
    }, {
        first_name: 'Test3',
        last_name: 'Admin',
        email: 'test3@admin',
        password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
        role: 'CLIENT'
    },
    {
        first_name: 'Test4',
        last_name: 'Admin',
        email: 'test4@admin',
        password: 'XQhZ4QFvA2h4Tq/cnzfylw==',
        role: 'CLIENT'
    }
]
