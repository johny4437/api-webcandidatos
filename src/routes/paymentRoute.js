const route = require('express').Router();
const {create, read} = require('../controllers/Payments/Payments');
const {candidateId} = require('../middlewares/candidateAuth');
const  {checkout} = require('../controllers/MercadoPago/MercadoPago')
route.post('/payments/create/:candidate_id', create);
route.get('/payments', read);
route.get('/payments/checkout',checkout );

route.param('candidate_id', candidateId);
module.exports = route;