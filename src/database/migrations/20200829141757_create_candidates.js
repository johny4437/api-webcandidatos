const knex = require('knex');

exports.up = function(knex) {

    return knex.schema.createTable('candidates', table =>{
    table.string('id').primary()
		table.text('name').notNullable()
		table.string('email').unique().notNullable()
    table.text('password').notNullable()
		table.text('party');
		table.text('coalition');
    table.text('telephone').notNullable();    
		table.integer('city_id').notNullable()
		table.foreign('city_id').references('id').inTable('cidades');
		table.integer('state_id').notNullable()
		table.foreign('state_id').references('id').inTable('estados');
		table.string('cpf').unique().notNullable()
		table.text('number');
    table.text('description');
    table.text('proposals');
    table.text('badges'); //vamos usar as badges estáticamente por enquanto
		table.text('profile_pic')
		table.text('url_profile_pic')
		table.text('cover_pic')
		table.text('url_cover_pic');
		table.string('login').unique().notNullable();
		table.text('doc_selfie');
		table.text('url_doc_selfie');
		table.text('doc_identity ');
		table.text('url_doc_identity');
		table.text('doc_files_candidate');
		table.text('url_doc_files_candidate');
		table.string('resetLink').defaultTo("");
		table.text('status').defaultTo("deactived") //se a conta é verificada
    table.text('qrcode') //qr code que levará para o perfil do usuário
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at');
	})
	
        
};

exports.down = function(knex) {
    return knex.schema.dropTable('candidates');
};

