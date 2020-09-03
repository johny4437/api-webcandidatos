const knex = require('knex')

exports.up = function(knex) {
return knex.schema.createTable('posts', function(table){
    table.increments();

    table.text('title');
    table.text('photo');
    table.text('photo_url');
    table.text('video');
    table.boolean('soft_delete').defaultTo(1);
    table.text('description');
    //table.specificType('likes', 'text ARRAY');
    table.string('user_id');
    table.foreign('user_id').references('id').inTable('users')
    table.string('candidate_id').notNullable();
    table.foreign('candidate_id').references('id').inTable('candidates');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.text('updated_at');

})
  
        
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};
