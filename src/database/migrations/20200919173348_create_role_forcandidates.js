const knex = require('knex');
exports.up = function(knex) {
return knex.schema.table('candidates', function (table) {
  table.string('role').defaultTo('1');
  
})
  
};

exports.down = function(knex) {
  
};

