const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
const qr = require('qr-image')
var upload = multer(multerConfig);
const {create, read,update, remove, singin,list, getCandidate} = require('../controllers/Candidates/candidateController');
const {followers} = require('../controllers/Candidates/Followers');
const auth = require('../middlewares/auth');
const {isAuthCandidate, candidateId} = require('../middlewares/candidateAuth');
const {readVisits} = require('../controllers/ViewProfile/viewProfile')
const {readViewPost} = require('../controllers/ViewPost/ViewPost')

var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1},{name:'doc_selfie', maxCount:1},{name:'doc_identity', maxCount:1},
 {name:'doc_files_candidate', maxCount:1}]);


route.post('/candidates/singup', cpUpload, create);
route.get('/candidates', read);
route.get('/candidates/list',list)
route.get('/candidates/:candidate_id', getCandidate);
route.put('/candidates/update/:candidate_id', auth,isAuthCandidate,cpUpload,update)
route.post('/candidates/singin',singin);
route.delete('/candidates/delete/:candidate_id', auth,isAuthCandidate, remove);

route.get('/followers/:candidate_id', auth,isAuthCandidate,followers);
// ================================================================
// VER NUMERO DE VISITANTES
route.get('/candidates/visits/:candidate_id',auth,isAuthCandidate,readVisits)
// VER NUMERO DE VISITANTES POR POST
route.get('/candidates/view-post/:candidate_id', auth, isAuthCandidate, readViewPost);


route.param('candidate_id', candidateId);


module.exports = route;