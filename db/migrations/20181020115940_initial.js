
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('wildfires', function (table) {
      table.increments('id').primary();
      table.string('latitude');
      table.string('longitude');
      table.string('report_date');
      table.string('media');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('wildfires'),
  ]);
};
