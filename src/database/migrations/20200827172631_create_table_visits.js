const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('visits', function(table){
      table.increments();
      table.integer('number_visits').defaultTo(0);
      table.text('user_id').notNullable();
      table.foreign('user_id').references('id').inTable('users');


      table.text('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.timestamp('visualizated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('visits');
};
