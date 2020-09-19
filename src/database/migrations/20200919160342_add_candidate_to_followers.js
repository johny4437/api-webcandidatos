const knex= require('knex')
exports.up = function(knex) {
  return knex.schema.table('followers', function (table) {
    table.string('candidate'); //id do candidato que segue outro candidate
    //table.foreign('candidate').references('id').inTable('candidates')
  })
};

exports.down = function(knex) {
  
};
