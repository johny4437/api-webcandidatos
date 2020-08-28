const knex= require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('proposals', function(table){
      table.increments();
      table.text('body').notNullable();

      table.text('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('updated_at');

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('proposals');
};
