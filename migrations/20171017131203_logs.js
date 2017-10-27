exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('logs', function(table) {
            table.increments('id').primary().unique();
            table.boolean('accepted');
            table.string('plate');
            table.string('file_path');
            table.string('reason');
            table.integer('vehicle_id').unsigned().references('vehicles.id');
            table.integer('realm_id').unsigned().references('realms.id');
            table.integer('camera_id').unsigned().references('cameras.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .then(() => {

            return knex('logs')
                .insert([{
                    accepted: false,
                    plate: '444BA8',
                    file_path: '/client/temp/1506611421690_IMG_0478.JPG',
                    camera_id: 1,
                    created_at: '2017-10-17 01:20:30'

                }, {
                    accepted: true,
                    plate: '444BAB',
                    file_path: '/client/temp/1506781784792_DSC_0437.JPG',
                    camera_id: 2,
                    created_at: '2017-10-02 06:50:40'
                }]);
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('logs');
};
/*
VEHICLES
ID
plate
make
model
*/
