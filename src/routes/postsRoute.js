const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer');
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const {userId, isAuth} = require('../middlewares/authController');
const {create} = require('../controllers/Posts/postController');
// upload de imagens
var cpUpload = upload.array('photos', 12);

route.post('/posts/create/:candidate_id',auth,cpUpload, isAuth,create);



route.param('candidate_id', userId);


module.exports = route;