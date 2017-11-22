exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('cameras', function(table) {
            table.increments('id').primary().unique();
            table.string('asset_tag').notNullable();
            table.string('alias');
            table.string('ip_address');
            table.integer('realm_id').unsigned();
            table.foreign('realm_id').onDelete('CASCADE').references('realms.id');

            table.integer('created_by').unsigned();
            table.foreign('created_by').onDelete('SET NULL').references('users.id');
            table.integer('updated_by').unsigned();
            table.foreign('updated_by').onDelete('SET NULL').references('users.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at');
        })
        .then(() => {

            return knex('cameras')
                .insert(dummy);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('cameras');
};
var dummy = [{
        realm_id: 1,
        asset_tag: 'C100001',
        ip_address: '123.56.43.201',
        alias: 'Peavärav'
    }, {
        realm_id: 1,
        asset_tag: 'C100002',
        alias: 'Garaaž'
    }, {
        realm_id: 2,
        asset_tag: 'C100003',
        ip_address: '254.87.23.111',
        alias: 'Peavärav'
    }, {
        realm_id: 2,
        asset_tag: 'C100004',
        alias: 'värav'
    },
    {
        realm_id: 3,
        asset_tag: 'C100005',
        ip_address: '123.56.43.201',
        alias: 'Peavärav'
    }, {
        realm_id: 3,
        asset_tag: 'C100006',
        alias: 'värav'
    }, {
        realm_id: 3,
        asset_tag: 'C100007',
        ip_address: '254.87.23.111',
        alias: 'Peavärav'
    }, {
        realm_id: 4,
        asset_tag: 'C100008',
        alias: 'värav'
    }, {
        realm_id: 4,
        asset_tag: 'C100009',
        alias: 'Tänava poolne'
    }, {
        realm_id: 4,
        asset_tag: 'C100010',
        alias: 'Garaaž'
    }, {
        realm_id: 4,
        asset_tag: 'C100011',
        alias: 'värav',
        ip_address: '255.255.255.255',
    }
]
