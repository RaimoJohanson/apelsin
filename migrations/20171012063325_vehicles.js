exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('vehicles', function(table) {
            table.increments('id').primary().unique();
            table.string('plate').notNullable();
            table.string('make');
            table.string('model');
            //table.boolean('accepted').defaultTo(true);
            table.integer('realm_id').unsigned();
            table.foreign('realm_id').onDelete('CASCADE').references('realms.id');
        })
        .then(() => {

            return knex('vehicles').insert(dummy);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('vehicles');
};
var dummy = [{
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

    },
    {
        make: 'Peugeot',
        model: '302',
        plate: '546UIS',
        realm_id: 2

    },
    {
        make: 'Ford',
        model: 'Sierra',
        plate: '420LOL',
        realm_id: 2

    },
    {
        make: 'Ferrari',
        model: '599',
        plate: '599FER',
        realm_id: 2

    },
    {
        make: 'Koenigsegg',
        model: 'Agera',
        plate: '892SWE',
        realm_id: 2

    },
    {
        make: 'Bugatti',
        model: 'Veyron',
        plate: '999BHP',
        realm_id: 1

    },
    {
        make: 'Ferrari',
        model: '458',
        plate: '458FER',
        realm_id: 1

    }
]

/*
VEHICLES
ID
plate
make
model
*/
