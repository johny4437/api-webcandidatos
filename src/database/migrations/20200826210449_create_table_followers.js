const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('followers',function(table){
      table.increments();

      table.text('user_id').notNullable();;
      table.text('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.timestamp('createdAt').defaultTo(knex.fn.now());

    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('followers');
};