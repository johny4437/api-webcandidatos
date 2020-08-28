const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('view_proposal', function(table){
      table.increments();
      table.text('user_id').notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.integer('proposal_id').notNullable();
      table.foreign('proposal_id').references('id').inTable('proposals');
      table.text('view_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('view_proposal');
};
