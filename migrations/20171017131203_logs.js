exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('logs', function(table) {
            table.increments('id').primary().unique();
            table.boolean('accepted');
            table.string('plate');
            table.string('file_name');
            table.string('reason');

            table.integer('vehicle_id').unsigned();
            table.foreign('vehicle_id').onDelete('SET NULL').references('vehicles.id');
            table.integer('realm_id').unsigned();
            table.foreign('realm_id').onDelete('CASCADE').references('realms.id');
            table.integer('camera_id').unsigned();
            table.foreign('camera_id').onDelete('SET NULL').references('cameras.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .then(() => {
            return knex('logs').insert(gen(500));
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('logs');
};

var gen = function(records) {
    let op = [];
    for (var i = 0; i < records; i++) {
        op.push({
            accepted: Math.floor((Math.random() * 10)) % 2,
            plate: getRandomInt(100, 999) + 'TST',
            file_name: 'DUMMY_DATA_' + Math.floor((Math.random() * 1000) + 1) + '.JPG',
            reason: Math.floor((Math.random() * 10)) % 2 ? 'Policy decision' : 'Default decision',
            camera_id: getRandomInt(1, 11),
            vehicle_id: getRandomInt(1, 13),
            realm_id: getRandomInt(1, 5),
            created_at: getRandomInt(2016, 2017) + '-' + getRandomInt(1, 12) + '-' + getRandomInt(1, 30) + ' ' + getRandomInt(1, 23) + ':' + getRandomInt(1, 59) + ':' + getRandomInt(1, 59)
        });

    }
    return op;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
