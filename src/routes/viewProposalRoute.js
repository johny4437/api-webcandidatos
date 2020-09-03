const route = require('express').Router();
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/userAuth');
const {create} = require('../controllers/ViewProfile/viewProfile');


route.post('/view-proposal/create/:user_id', auth, isAuth, create);



route.param('user_id', userId);
module.exports = route;