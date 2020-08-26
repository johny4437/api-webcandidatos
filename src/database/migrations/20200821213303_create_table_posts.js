const knex = require('knex')

exports.up = function(knex) {
return knex.schema.createTable('posts', function(table){
    table.increments();

    table.text('title');
    table.text('photo');
    table.text('photo_url');
    table.text('video');
    table.text('description');
    table.specificType('likes', 'text ARRAY');
    table.string('user_id');
    //table.foreign('user_id').references('id').inTable('users')
    //ERROR
    /*
      FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations
FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations
migration file "20200821213303_create_table_posts.js" failed
migration failed with error: alter table "posts" add constraint "posts_user_id_foreign" foreign key ("user_id") references "users" ("id") - there is no unique constraint matching given keys for referenced table "users"error: alter table "posts" add constraint "posts_user_id_foreign" foreign key ("user_id") references "users" ("id") - there is no unique constraint matching given keys for referenced table "users"
    at Parser.parseErrorMessage (D:\DESTRUTOR\BURN BRAIN\CODES\PROJETOS\candidates\api-webcandidatos\node_modules\pg-protocol\dist\parser.js:278:15)
    at Parser.handlePacket (D:\DESTRUTOR\BURN BRAIN\CODES\PROJETOS\candidates\api-webcandidatos\node_modules\pg-protocol\dist\parser.js:126:29)
    at Parser.parse (D:\DESTRUTOR\BURN BRAIN\CODES\PROJETOS\candidates\api-webcandidatos\node_modules\pg-protocol\dist\parser.js:39:38)
    at Socket.<anonymous> (D:\DESTRUTOR\BURN BRAIN\CODES\PROJETOS\candidates\api-webcandidatos\node_modules\pg-protocol\dist\index.js:8:42)
    at Socket.emit (events.js:315:20)
    at addChunk (_stream_readable.js:295:12)
    at readableAddChunk (_stream_readable.js:271:9)
    at Socket.Readable.push (_stream_readable.js:212:10)
    at TCP.onStreamRead (internal/stream_base_commons.js:186:23)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
    */
    table.string('candidate_id').notNullable();
    table.foreign('candidate_id').references('id').inTable('candidates');
})
  
        
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};
