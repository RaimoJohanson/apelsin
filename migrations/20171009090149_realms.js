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

            return knex('realms')
                .insert([{
                        name: 'Maakodu',
                        country: 'Eesti',
                        region: 'Lääne-Virumaa',
                        city: 'Rakvere vald',
                        street: 'Kasekünka talu'
                    }, {
                        name: 'Test objekt',
                        country: 'Eesti',
                        region: 'Harjumaa'
                    },
                    {
                        name: 'Test objekt 2',
                        country: 'Eesti',
                        region: 'Saaremaa'
                    },
                    {
                        name: 'Test objekt 3',
                        country: 'Eesti',
                        region: 'Lääne-Virumaa'
                    },
                    {
                        name: 'Test objekt 4',
                        country: 'Eesti',
                        region: 'Tartumaa'
                    }
                ]);
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
