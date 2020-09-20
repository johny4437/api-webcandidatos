const route = require('express').Router();
const { userId, isAuth} = require('../middlewares/userAuth');
const { candidateId, isAuthCandidate} = require('../middlewares/candidateAuth');
const {likeCreate, readLikes, likeDelete, likeCreateCandidate, likeDeleteCandidate} = require('../controllers/Users/Like');
const auth = require('../middlewares/auth');


route.post('/like/:user_id/:type_user', auth, isAuth, likeCreate);
route.post('/unlike/:user_id/:type_user', auth, isAuth, likeDelete);

route.post('/like_candidate/:candidate_id/:type_user', auth, isAuthCandidate, likeCreateCandidate);
route.post('/unlike_candidate/:candidate_id/:type_user', auth, isAuthCandidate, likeDeleteCandidate);

route.post('/likes', readLikes);
route.get('/test',(req,res) => {

res.json({msg:'Everything\'s gonna be alright'});

})
route.param('user_id', userId);
route.param('candidate_id', candidateId);
module.exports= route;
 