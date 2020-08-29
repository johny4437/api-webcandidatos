const knex= require('knex')
exports.up = function(knex) {
    return knex.schema.createTable('share_whatsapp', function(table){
        table.increments();
        table.text('user_id');
        table.foreign('user_id').references('id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
  
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('share_whatsapp');
};
