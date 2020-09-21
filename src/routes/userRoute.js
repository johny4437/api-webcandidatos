const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const { userId, isAuth} = require('../middlewares/userAuth');
const {createUser, readUser, updateUser ,singout} = require('../controllers/Users/users');
const {follow, unfollow} = require('../controllers/Users/Follow');
const {createComments, readComments, updateComments, deleteComments} = require('../controllers/Users/Comments');
const {createViewHastag} = require('../controllers/ViewHastags/ViewHastags');
const {singin} = require('../controllers/Candidates/candidateController')



route.post('/user/singup', createUser);
route.post('/user/singin', singin);
route.get('/user/singout',singout)
route.get('/user', readUser);
route.put('/user/update/:user_id', auth, isAuth, upload.single('profile_pic'), updateUser);
// FORGOT PASSWORD
// ===========================================================================



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
// ======================================================================
// VIEW HASTAGS
route.post('/user/view-hastags/:user_id',auth, isAuth ,createViewHastag);



route.param('user_id', userId);
module.exports = route;