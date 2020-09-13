const Mercadopago = require('mercadopago');
var oldAccessToken = Mercadopago.configurations.setAccessToken();
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const getFullUrl = (req) =>{
	const url = req.protocol + '://' + req.get('host');
	console.log(url)
	return url;
}


exports.checkout = async(req, res) =>{
	Mercadopago.configure({
		sandbox: true,
  		access_token: "TEST-72547546986684-052613-8d6be443a62b75c5ddd1ea8ce5e5fd24-243177627"

	})

   const {email} = req.params;
    
        // Create purchase item object template
        const purchaseOrder = {
            items: [
              item = {
                id: 2,
                title: 'Assinatura Web  Candidatos',
                description : 'Assinatura Web Candidatos',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat('1999,99')
              }
            ],
            payer : {
              email: email
            }
          
          }
      
          //Generate init_point to checkout
          try {
            await Mercadopago.preferences.create(purchaseOrder).then(data =>{
             res.json(data)
            }).catch(err => res.json(err));
            
          }catch(err){
            return res.json(err.message);
       

          }







}
exports.boletoPayment = (req, res) =>{


  const transporter = nodemailer.createTransport({
                pool: true,
                host: "mail.webcandidatos.com.br",
                port: 465,
                secure: true, // use TLS
                auth: {
                    user: "noreply@webcandidatos.com.br",
                    pass: "ImaG9tC8pWJ5"
                }
         });


    

  Mercadopago.configurations.setAccessToken('TEST-72547546986684-052613-8d6be443a62b75c5ddd1ea8ce5e5fd24-243177627');

  const {email, cpf, first_name} = req.body
  console.log(cpf)
  console.log(email)

var payment_data = {
  transaction_amount: 1999.99,
  description: 'Web Candidatos Assinatura',
  payment_method_id: 'bolbradesco',
  payer: {
    email:'anastaciojohny83@gmail.com',
    first_name: 'johnyS',
    last_name: 'User',
    identification: {
        type: 'CPF',
        number: '19119119100'
    },
    address:  {
        zip_code: '06233200',
        street_name: 'Av. das Nações Unidas',
        street_number: '3003',
        neighborhood: 'Bonfim',
        city: 'Osasco',
        federal_unit: 'SP'
    }
  }
};

Mercadopago.payment.create(payment_data).then(function (data) {

const mailOptions = {
              from: 'noreply@webcandidatos.com.br',
              to: email,
              subject: 'Link Para Gerar Boleto',
              text:` seu boleto foi gerado com sucesso.\n\n`
              +'Por Favor Clique no link abaixo para imprimí-lo.\n\n'
              +`${data.body.transaction_details.external_resource_url}`

     };
     transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                           res.status(400).json(error);
                    } else {
                        let msg = 'Email sent. Follow the instructions';
                        var data = {
                          msg
                        }
                         res.status(200).json(data);

                }});  




}).catch(function (error) {
res.json(error)
});



}