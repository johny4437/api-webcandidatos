const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
const qr = require('qr-image')
var upload = multer(multerConfig);
const {createCandidate, readCandidate,updateCandidate, removeCandidate, singin,listCandidate, getCandidate} = require('../controllers/Candidates/candidateController');
const {followers} = require('../controllers/Candidates/Followers');
const auth = require('../middlewares/auth');
const {isAuthCandidate, candidateId} = require('../middlewares/candidateAuth');
const {readVisits} = require('../controllers/ViewProfile/viewProfile')
const {readViewPost} = require('../controllers/ViewPost/ViewPost')
const {createBadge, readBadges, updateBadge} = require('../controllers/BadgeCandidates/Badges');
const {createHastag, readHastags} = require('../controllers/Hastags/Hastags');

var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1},{name:'doc_selfie', maxCount:1},{name:'doc_identity', maxCount:1},
 {name:'doc_files_candidate', maxCount:1}]);


route.post('/candidates/singup', cpUpload, createCandidate);
route.get('/candidates', readCandidate);
route.get('/candidates/list',listCandidate)
route.get('/candidates/:candidate_id', getCandidate);
route.put('/candidates/update/:candidate_id', auth,isAuthCandidate,cpUpload,updateCandidate)
route.post('/candidates/singin',singin);
route.delete('/candidates/delete/:candidate_id', auth,isAuthCandidate, removeCandidate);

route.get('/followers/:candidate_id', auth,isAuthCandidate,followers);
// ================================================================
// VER NUMERO DE VISITANTES
route.get('/candidates/visits/:candidate_id',auth,isAuthCandidate,readVisits)
// VER NUMERO DE VISITANTES POR POST
route.get('/candidates/view-post/:candidate_id', auth, isAuthCandidate, readViewPost);
//======================================================================================
// BADGES ROUTE
route.post('/candidates/badges/create/:candidate_id', auth, isAuthCandidate, createBadge);
route.get('/badges', readBadges);
route.put('/badges/update/:candidate_id',auth, isAuthCandidate, updateBadge);
// ===========================================================================================
// HASTAGS

route.post('/hastags/:candidate_id',auth, isAuthCandidate, createHastag);
route.get('/hastags', readHastags);



route.param('candidate_id', candidateId);


module.exports = route;