const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('favorites', function(table){
    table.increments();

    table.text('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.text('candidate_id').notNullable();
    table.foreign('candidate_id').references('id').inTable('candidates');
    table.text('created_at');
    table.text('updated_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};
