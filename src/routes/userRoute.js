const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const { userId, isAuth} = require('../middlewares/userAuth');
const {create, read, update , singin} = require('../controllers/Users/users');
const {likeCreate} = require('../controllers/Users/Like');




route.post('/user/singup', upload.single('photo'), create);
route.post('/user/singin', singin);
route.get('/user', read);
route.put('/user/update/:user_id', auth, isAuth, upload.single('photo'), update);
route.put('/like/:post_id/:user_id', auth, isAuth, likeCreate);

route.param('user_id', userId);
module.exports = route;