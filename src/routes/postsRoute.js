const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const {candidateId, isAuthCandidate} = require('../middlewares/candidateAuth');
const {createPost,removePost,updatePost, listAllPosts, listAllPostsLogin, countNumLikes, postIsLiked} = require('../controllers/Posts/postController');





route.post('/posts/create/:candidate_id',auth, isAuthCandidate, upload.array('photo', 12), createPost);
route.put('/posts/update/:candidate_id',auth, isAuthCandidate, upload.array('photo', 12), updatePost);
route.get('/posts/:candidate_id', listAllPosts);
route.get('/posts/login/:login', listAllPostsLogin);
route.get('/posts/count_likes/:post_id', countNumLikes);
route.get('/posts/is_liked/:post_id/:user_id/:type_user', postIsLiked);
route.delete('/posts/remove/:candidate_id/', auth, isAuthCandidate, removePost);




route.param('candidate_id', candidateId);


module.exports = route;