const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('comments', function(table){
      table.increments();
      table.text('body').notNullable();
      table.text('user_id').notNullable();
      table.integer('post_id').notNullable();
      table.foreign('post_id').references('id').inTable('posts');
      table.timestamp('createdAt').defaultTo(knex.fn.now());

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};