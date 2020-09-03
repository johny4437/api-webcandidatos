const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('search_query', function(table){
    table.increments();
    
    table.text('query');
    table.string('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('search_query');
};