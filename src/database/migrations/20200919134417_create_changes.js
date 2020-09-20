const knex = require('knex');
exports.up = function(knex) {
return knex.schema.table('users', function (table) {
  table.integer('state_id');
  table.foreign('state_id').references('id').inTable('estados')
  table.integer('city_id');
  table.foreign('city_id').references('id').inTable('cidades')
  
})
  
};

exports.down = function(knex) {
  
};
