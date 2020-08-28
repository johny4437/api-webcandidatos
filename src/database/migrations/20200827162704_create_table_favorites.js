const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('favorites', function(table){
    table.increments();

    table.text('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.text('candidate_id').notNullable();
    table.foreign('candidate_id').references('id').inTable('candidates');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};
