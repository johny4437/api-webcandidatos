const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('view_hastags', function(table){
      table.increments();

      table.text('user_id').notNullable();
      table.integer('hastag_id').notNullable();
      table.foreign('hastag_id').references('id').inTable('hastags');

      table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('view_hastags');
};
