const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const {candidateId, isAuthCandidate} = require('../middlewares/candidateAuth');
const {create, update, listAllPosts} = require('../controllers/Posts/postController');





route.post('/posts/create/:candidate_id',auth, isAuthCandidate,upload.array('photo', 12),create);
route.put('/posts/update/:candidate_id',auth, isAuthCandidate,upload.array('photo', 12),update);
route.get('/posts/:candidate_id', listAllPosts);




route.param('candidate_id', candidateId);


module.exports = route;