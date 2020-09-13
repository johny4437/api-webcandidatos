const Mercadopago = require('mercadopago');
var oldAccessToken = Mercadopago.configurations.getAccessToken();
const crypto = require('crypto')
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