const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('admin', function(table){
      table.text('id').notNullable();
      table.text('username').notNullable();
      table.text('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('update_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('admin');
};
