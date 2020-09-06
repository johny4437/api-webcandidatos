const knex = require('knex');
exports.up = function(knex) {
    return knex.schema.createTable('badges_candidates', function(table){
        table.increments();

        table.text('candidate_id').notNullable();
        table.foreign('candidate_id').references('id').inTable('candidates');
       table.string('badge');
        table.timestamp('created_at');
        table.text('updated_at');
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('badges_candidates');
};