const route = require('express').Router();
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/userAuth');
const { create, read, remove} = require('../controllers/Favorites/Favorites');


route.post('/favorites/create/:user_id',auth, isAuth, create);
route.get('/favorites/:user_id', auth, isAuth, read);
route.delete('/favorites/remove/:user_id', auth, isAuth,remove);
route.param('user_id', userId);
module.exports = route;