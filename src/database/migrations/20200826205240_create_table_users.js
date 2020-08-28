const knex = require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
      table.text('id').primary().notNullable();
      table.text('name').notNullable();
      table.text('email').notNullable();
      table.text('password').notNullable();
      table.text('profile_pic');
      table.text('photo_url');
      table.text('candidatesFollowed');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('updated_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};

