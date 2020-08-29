const knex = require('../../database/connection');

exports.create = async (req, res) => {

    const candidate_id = req.params.candidate_id;
    console.log(candidate_id)

    const {
        platform, 
        charge_id, 
        value, 
        status,
        payment_method,
        link
    } = req.body;

    var now = new Date();

    const expired_at = now.getDate() + 2;
    
    
    const payment = {
        platform, 
        charge_id, 
        value, 
        status,
        payment_method,
        link,
        candidate_id,
        expired_at
    }

   await knex('payments').insert(payment)
   .then(() => {
       res.status(200).json({msg:"PAYMENT SAVED"})
   }).catch(() => {
       res.status(400).json({error:"NOT SAVED"})
   })
}

exports.read = (req, res) => {
    const candidate_id = req.params.candidate_id;

    knex('payments').select('*').where('candidate_id', candidate_id)
    .then(dataPayment => {
        if(dataPayment.length !== 0){
            res.status(200).json(dataPayment);
        }else{
            res.status(404).json({msg:"THERE ARE NO PAYMENTS"})
        }
    })

}