const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('badges', function(table){
      table.increments();
      table.text('badge');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('updated_at');

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('badges');
};
