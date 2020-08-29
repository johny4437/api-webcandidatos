const route = require('express').Router();
const auth = require('../middlewares/auth');
const { userId, isAuth} = require('../middlewares/userAuth');
const {createQuery} = require('../controllers/SearchQuery/SearchQuery');

//======================================================================
//PEGAR TECLAS DIGITADAS PELO USUÁRIO
route.post('/user/search/:user_id', createQuery);

route.param('user_id', userId);
module.exports = route;