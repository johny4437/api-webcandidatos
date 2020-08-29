const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('view_post', function(table){
      table.increments();
      table.text('user_id').notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.integer('post_id').notNullable();
      table.foreign('post_id').references('id').inTable('posts');
      table.text('view_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('view_post');
};