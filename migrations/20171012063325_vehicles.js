exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('vehicles', function(table) {
            table.increments('id').primary().unique();
            table.string('plate').notNullable();
            table.string('make');
            table.string('model');
            //table.boolean('accepted').defaultTo(true);
            table.integer('realm_id').unsigned().references('realms.id');
        })
        .then(() => {

            return knex('vehicles')
                .insert([{
                        make: 'Saab',
                        model: '9-3',
                        plate: '444BAB',
                        realm_id: 1

                    }, {
                        make: 'Seat',
                        model: 'Cordoba',
                        plate: '123ARU',
                        realm_id: 2
                    },
                    {
                        make: 'Seat',
                        model: 'Cordoba',
                        plate: '123ARU',
                        realm_id: 1
                    },
                    {
                        make: 'Ford',
                        model: 'Mondeo',
                        plate: '972APC',
                        realm_id: 1

                    }, {
                        make: 'Bmw',
                        model: '3. seeria',
                        plate: '435AFP',
                        realm_id: 1

                    },
                    {
                        make: 'Audi',
                        model: '80',
                        plate: '435LKJ',
                        realm_id: 2

                    },
                    {
                        make: 'Audi',
                        model: 'A6',
                        plate: '656AUD',
                        realm_id: 2

                    }
                ]);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('vehicles');
};
/*
VEHICLES
ID
plate
make
model
*/
