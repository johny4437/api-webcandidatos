const route = require('express').Router();
const {create} = require('../controllers/Payments/Payments');
const {candidateId} = require('../middlewares/candidateAuth');

route.post('/payments/create/:candidate_id', create);


route.param('candidate_id', candidateId);
module.exports = route;