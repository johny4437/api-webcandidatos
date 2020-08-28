const route = require('express').Router();
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/userAuth');
const {create} = require('../controllers/ViewPost/ViewPost')

route.post('/view-post/create/:user_id', auth, isAuth,create);

route.param('user_id', userId);
module.exports = route;