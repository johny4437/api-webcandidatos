const nodemailer = require('nodemailer');
const path= require('path')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})
exports.createContact = (req,res) =>{
const {name, email, telephone, subject, message} = req.body;
	  const transporter = nodemailer.createTransport({
          pool: true,
          host: "mail.webcandidatos.com.br",
          port: 465,
          secure: true, // use TLS
          auth: {
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
            }
         });

      const mailOptions = {
      from: 'noreply@webcandidatos.com.br',
      to: 'contato@webcandidatos.com.br',
      subject: subject,
      text:`nome:${name}\n`
      +`telefone:${telephone}\n`
      +`email:${email}\n\n`
      +`${message}` 

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

                }})

	



	


}