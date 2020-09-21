const knex= require('knex')
exports.up = function(knex) {
  return knex.schema.table('likes', function (table) {
    table.string('candidate_id'); //id do candidato que segue outro candidate
    //table.foreign('candidate').references('id').inTable('candidates')
  })
};

exports.down = function(knex) {
  
};
