const route = require('express').Router();
const { userId, isAuth} = require('../middlewares/userAuth');
const {likeCreate, readLikes} = require('../controllers/Users/Like');
const auth = require('../middlewares/auth');


route.post('/likes/:user_id', auth, isAuth, likeCreate);
route.post('/likes', readLikes);
route.get('/test',(req,res) => {

res.json({msg:'Hello Bitch'});

})
route.param('user_id', userId);
module.exports= route;
