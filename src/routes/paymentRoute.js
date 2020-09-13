const route = require('express').Router();
const {create, read} = require('../controllers/Payments/Payments');
const {candidateId} = require('../middlewares/candidateAuth');
const  {checkout, boletoPayment} = require('../controllers/MercadoPago/MercadoPago')
route.post('/payments/create/:candidate_id', create);
route.get('/payments', read);
route.get('/payments/checkout/:email',checkout );
route.post('/payments/boleto', boletoPayment)

route.param('candidate_id', candidateId);
module.exports = route;