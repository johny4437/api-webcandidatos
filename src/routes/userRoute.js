const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const { userId, isAuth} = require('../middlewares/userAuth');
const {create, read, update , singin} = require('../controllers/Users/users');
const {likeCreate} = require('../controllers/Users/Like');
const {follow, unfollow} = require('../controllers/Users/Follow');
const {createComments, readComments, updateComments, deleteComments} = require('../controllers/Users/Comments');



route.post('/user/singup', upload.single('photo'), create);
route.post('/user/singin', singin);
route.get('/user', read);
route.put('/user/update/:user_id', auth, isAuth, upload.single('photo'), update);
// =================================================================================
// like route
route.post('/like/:post_id/:user_id', auth, isAuth, likeCreate);
// =================================================================================
// follow and unfollow route
route.post('/follow/:user_id', auth, isAuth, follow);
route.delete('/unfollow/:user_id',auth, isAuth, unfollow);
// ==================================================================================
// comments route

route.post('/user/comment/create/:user_id', auth, isAuth, createComments );
route.get('/comments', readComments);
route.put('/comments/update/:user_id', auth, isAuth, updateComments);
route.delete('/comments/delete/:user_id', auth, isAuth,deleteComments);


route.param('user_id', userId);
module.exports = route;