const knex = require('knex');

exports.up = function(knex) {

    return knex.schema.createTable('candidates', table =>{
        table.string('id').primary()
		table.text('name')
		table.text('email')
        table.text('password')
		table.text('party')
		table.text('coalition')
		table.text('city')
		table.text('state')
		table.text('cpf')
		table.text('number').unique().notNullable()
		table.text('description')
		table.text('profile_pic')
		table.text('url_profile_pic')
		table.text('cover_pic')
		table.text('url_cover_pic')
		table.text('doc_selfie')
		table.text('url_doc_selfie')
		table.text('doc_identity ')
		table.text('url_doc_identity');
		table.text('doc_files_candidate');
		table.text('url_doc_files_candidate');
		table.text('status') //se a conta é verificada
        table.text('qrcode') //qr code que levará para o perfil do usuário
		table.timestamp('created_at').defaultTo(knex.fn.now());
	})
	
        
};

exports.down = function(knex) {
    return knex.schema.dropTable('candidates');
};

