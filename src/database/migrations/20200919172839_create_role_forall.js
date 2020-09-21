
const knex = require('knex');
exports.up = function(knex) {
return knex.schema.table('users', function (table) {
  table.string('role').defaultTo('0');
  
})
  
};

exports.down = function(knex) {
  
};
