const knex= require('knex')
exports.up = function(knex) {
  return knex.schema.createTable('view_qrcode', function(table){
      table.increments();
      table.text('user_id');
      table.foreign('user_id').references('id').inTable('users')
      table.timestamp('created_at').defaultTo(knex.fn.now());

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('view_qrcode');
};
