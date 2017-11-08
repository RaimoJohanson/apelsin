exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('cameras', function(table) {
            table.increments('id').primary().unique();
            table.string('asset_tag').notNullable();
            table.string('alias');
            table.string('ip_address');
            table.integer('realm_id').unsigned();
            table.foreign('realm_id').onDelete('CASCADE').references('realms.id');
        })
        .then(() => {

            return knex('cameras')
                .insert([{
                    realm_id: 1,
                    asset_tag: 'C123456',
                    ip_address: '123.56.43.201',
                    alias: 'Peavärav'
                }, {
                    realm_id: 2,
                    asset_tag: 'C654321',
                    alias: 'värav'
                }]);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('cameras');
};
