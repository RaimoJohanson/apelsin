exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('rules', function(table) {
            table.increments('id').primary().unique();
            table.boolean('accepted').notNullable();
            table.boolean('mon').defaultTo(false);
            table.boolean('tue').defaultTo(false);
            table.boolean('wed').defaultTo(false);
            table.boolean('thu').defaultTo(false);
            table.boolean('fri').defaultTo(false);
            table.boolean('sat').defaultTo(false);
            table.boolean('sun').defaultTo(false);
            table.date('begin_date');
            table.date('end_date');
            table.time('begin_time');
            table.time('end_time');
            table.integer('vehicle_id').unsigned().references('vehicles.id');
            table.integer('realm_id').unsigned().references('realms.id');
        }).then(() => {

            return knex('rules')
                .insert([{
                        accepted: 0,
                        fri: 1,
                        sat: 1,
                        sun: 1,
                        begin_date: '2017-10-23',
                        end_date: '2017-12-23',
                        begin_time: '17:00:00',
                        end_time: '17:00:00',
                        vehicle_id: 1,
                        realm_id: 1
                    }, {
                        accepted: 1,
                        begin_date: '2017-10-23',
                        end_date: '2017-12-23',
                        begin_time: '17:00:00',
                        end_time: '17:00:00',
                        vehicle_id: 2,
                        realm_id: 1
                    },
                    {
                        accepted: 1,
                        begin_date: '2017-10-23',
                        end_date: '2017-12-23',
                        begin_time: '17:00:00',
                        end_time: '17:00:00',
                        vehicle_id: 1,
                        realm_id: 2
                    }
                ]);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('rules');
};
