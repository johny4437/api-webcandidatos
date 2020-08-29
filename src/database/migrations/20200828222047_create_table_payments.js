const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('payments', function(table){
      table.increments();

      table.text('charge_id').notNullable();
      table.text('value');
      table.text('platform');
      table.text('status').defaultTo('aberto');
      table.text('payment_method');
      table.text('link');
      table.text('candidate_id').notNullable();
      table.foreign('candidate_id').references('id').inTable('candidates');
      table.text('expired_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('updated_at')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};
