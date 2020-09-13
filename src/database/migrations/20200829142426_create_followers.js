const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('followers',function(table){
      table.increments();

      table.string('user_id').notNullable();;
      table.string('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('updated_at');

    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('followers');
};
