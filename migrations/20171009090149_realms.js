exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('realms', function(table) {
            table.increments('id').primary().unique();
            table.string('name').notNullable();
            table.string('country');
            table.string('region');
            table.string('city');
            table.string('street');
            table.string('street_number');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at');
            table.integer('created_by').unsigned();
            table.foreign('created_by').onDelete('SET NULL').references('users.id');
            table.integer('updated_by').unsigned();
            table.foreign('updated_by').onDelete('SET NULL').references('users.id');
        })
        .then(() => {

            return knex('realms').insert(dummy);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('realms');
};
/*

Country
Region (State / Province)
Locality (City / Municipality)
Sub-Locality (County / other sub-division of a locality)
Street
*/
var dummy = [{
        name: 'Maakodu',
        country: 'Eesti',
        region: 'Lääne-Virumaa',
        city: 'Rakvere vald',
        street: 'Kasekünka talu'
    }, {
        name: 'KÜ Virbi 2',
        country: 'Eesti',
        region: 'Harjumaa',
        city: 'Tallinn',
        street: 'Virbi',
        street_number: '2'
    },
    {
        name: 'KÜ Tehnika 78',
        country: 'Eesti',
        region: 'Harjumaa',
        city: 'Tallinn',
        street: 'Tehnika',
        street_number: '78'
    },
    {
        name: 'Merelaine turismitalu',
        country: 'Eesti',
        region: 'Saaremaa',
        city: 'Saare vald',
        street: 'Veski talu'
    },
    {
        name: 'EMÜ ühiselamu',
        country: 'Eesti',
        region: 'Tartumaa',
        city: 'Tartu',
        street: 'Kreutzwaldi',
        street_number: '52'
    }, {
        name: 'KÜ Kungla 11',
        country: 'Eesti',
        region: 'Lääne-Virumaa',
        city: 'Rakvere',
        street: 'Kungla',
        street_number: '11'
    }
]
