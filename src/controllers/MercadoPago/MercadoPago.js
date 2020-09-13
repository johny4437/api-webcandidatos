const Mercadopago = require('mercadopago');
var oldAccessToken = Mercadopago.configurations.getAccessToken();

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

   const { id, email, description, amount } = req.body;

        // Create purchase item object template
        const purchaseOrder = {
            items: [
              item = {
                id: id,
                title: description,
                description : description,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(amount)
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