const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const { createCandidate, readCandidates,updateCandidate, removeCandidate, singin, getOneCandidate} = require('../controllers/Candidates/candidateController');
const {getFollowers} = require('../controllers/Users/Follow');
const auth = require('../middlewares/auth');
const {isAuthCandidate, candidateId} = require('../middlewares/candidateAuth');
const {readVisits} = require('../controllers/ViewProfile/viewProfile')
const {readViewPost} = require('../controllers/ViewPost/ViewPost')
const {createBadge, readBadges, updateBadge} = require('../controllers/BadgeCandidates/Badges');
const {createHastag, readHastags} = require('../controllers/Hastags/Hastags');

var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1},{name:'doc_selfie', maxCount:1},{name:'doc_identity', maxCount:1},
 {name:'doc_files_candidate', maxCount:1}]);


route.post('/candidates/singup', createCandidate);

// route.post('/candidates/singup', (req, res) => {
//   console.log('field: '+req.body.email)
// });

route.get('/candidates', readCandidates);
// route.get('/candidates/list',listCandidate)
route.get('/candidates/:login', getOneCandidate);
route.put('/candidates/update/:candidate_id', auth,isAuthCandidate,cpUpload,updateCandidate)
route.post('/candidates/singin',singin);
route.delete('/candidates/delete/:candidate_id', auth,isAuthCandidate, removeCandidate);
// numero de seguidore
route.get('/followers/:candidate_id', auth,isAuthCandidate,getFollowers);
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