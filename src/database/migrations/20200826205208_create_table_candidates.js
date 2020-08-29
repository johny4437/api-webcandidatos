const knex = require('knex');

exports.up = function(knex) {

    return knex.schema.createTable('candidates', table =>{
        table.string('id').primary()
		table.text('name').notNullable()
		table.text('email').notNullable()
        table.text('password').notNullable()
		table.text('party').notNullable()
		table.text('coalition').notNullable()
		table.text('city').notNullable()
		table.text('state').notNullable()
		table.text('cpf').unique().notNullable()
		table.text('number').notNullable()
		table.text('description').notNullable()
		table.text('profile_pic')
		table.text('url_profile_pic')
		table.text('cover_pic')
		table.text('url_cover_pic');
		table.text('login').unique().notNullable();
		table.text('doc_selfie').notNullable()
		table.text('url_doc_selfie').notNullable()
		table.text('doc_identity ').notNullable()
		table.text('url_doc_identity').notNullable();
		table.text('doc_files_candidate').notNullable();
		table.text('url_doc_files_candidate').notNullable();
		table.text('status') //se a conta é verificada
        table.text('qrcode') //qr code que levará para o perfil do usuário
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at');
	})
	
        
};

exports.down = function(knex) {
    return knex.schema.dropTable('candidates');
};

