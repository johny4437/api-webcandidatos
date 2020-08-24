const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
const qr = require('qr-image')
var upload = multer(multerConfig);
const {create, update, remove, singin} = require('../controllers/CandidatesConrollers/candidateController');
const auth = require('../middlewares/auth');
const {isAuth, userId} = require('../middlewares/candidateAuth');


var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1},{name:'doc_selfie', maxCount:1},{name:'doc_identity', maxCount:1},
 {name:'doc_files_candidate', maxCount:1}]);


route.post('/candidates/singup', cpUpload, create);
route.put('/candidates/update/:candidate_id', auth,isAuth,cpUpload,update)
route.post('/candidates/singin',singin);
route.delete('/candidates/delete/:candidate_id', auth,isAuth, remove);


route.param('candidate_id', userId);


module.exports = route;