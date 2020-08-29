const knex = require('knex') 
exports.up = function(knex) {
  return knex.schema.createTable('hastags', function(table){
      table.increments();
      table.text('hastag').notNullable();
      table.text('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('hastags');
};
