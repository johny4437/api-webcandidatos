const route = require('express').Router();
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/candidateAuth');
const {create,read} = require('../controllers/Proposals/proposal');


route.post('/proposals/create/:candidate_id', auth, isAuth, create);
route.get('/proposals',read );



route.param('candidate_id', userId);


module.exports = route;