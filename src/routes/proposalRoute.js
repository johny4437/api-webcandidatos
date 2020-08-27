const route = require('express').Router();
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/candidateAuth');
const {create} = require('../controllers/Proposals/proposal');


route.post('/proposals/create/:candidate_id', auth, isAuth, create);


route.param('candidate_id', userId);


module.exports = route;