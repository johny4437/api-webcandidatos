const knex = require('knex')

exports.up = function(knex) {
return knex.schema.createTable('posts', function(table){
    table.increments();

    table.text('title');
    table.text('photo');
    table.text('photo_url');
    table.text('video');
    table.text('description');

    table.string('candidate_id').notNullable();
    table.foreign('candidate_id').references('id').inTable('candidates')
})
  
        
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};
