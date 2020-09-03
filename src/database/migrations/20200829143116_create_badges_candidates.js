const knex = require('knex');
exports.up = function(knex) {
    return knex.schema.createTable('badges_candidates', function(table){
        table.increments();

        table.text('canidate_id').notNullable();
        // table.foreign('candidate_id').references('id').inTable('candidates');
        table.integer('badge_id').notNullable();
        // table.foreign('badge_id').references('id').inTable('badges')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.text('updated_at');
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('badges_candidates');
};