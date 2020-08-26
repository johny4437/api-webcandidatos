const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('likes', function(table){
      table.increments();

      table.boolean('status').notNullable().defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('user_id');
      table.integer('post_id').notNullable();
      table.foreign('post_id').references("id").inTable('posts');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  
};
