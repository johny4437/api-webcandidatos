const route = require('express').Router();
const auth = require('../middlewares/auth');
const {candidateId, isAuthCandidate} = require('../middlewares/candidateAuth');
const {create,read} = require('../controllers/Proposals/proposal');


route.post('/proposals/create/:candidate_id', auth, isAuthCandidate, create);
route.get('/proposals',read );



route.param('candidate_id', candidateId);


module.exports = route;