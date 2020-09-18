const knex = require('knex');
exports.up = function(knex) {
  
    return knex.schema.createTable('roles', function(table){
    	  table.increments();
    	  table.text('roles').notNullable();
    	  table.text('candidate_id')
    	  table.foreign('candidate_id').references('id').inTable('candidates');
    	  table.text('user_id')
    	  table.foreign('user_id').references('id').inTable('users')
    	  table.timestamp('created_at').defaultTo(knex.fn.now());



    })
};

exports.down = function(knex) {
	  return knex.schema.dropTable('roles');
  
};
