const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('likes', function(table){
      table.increments();

      table.boolean('status').notNullable().defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('user_id');
      table.text('post_id');
  })
};

exports.down = function(knex) {
  
};
