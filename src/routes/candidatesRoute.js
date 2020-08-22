const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
const qr = require('qr-image')
var upload = multer(multerConfig);
const {create, update, remove} = require('../controllers/CandidatesConrollers/candidateController');
const {singin} = require('../controllers/CandidatesConrollers/authController');
const auth = require('../middlewares/auth');



var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1}]);


route.post('/candidates/singup', cpUpload, create);
route.put('/candidates/update', auth,cpUpload,update)
route.post('/candidates/singin',singin);
route.delete('/candidates/:user_id', auth, remove);



module.exports = route;