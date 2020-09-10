const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const { 
    createCandidate, 
    readCandidates,
    updateCandidate, 
    removeCandidate, 
    singin,
    singout, 
    getOneCandidate,
    getSomeCandidateData,
    updatePassword,
    forgotPassword,
    resetPassword,
    setNewForgotPass
    
} = require('../controllers/Candidates/candidateController');
const {getFollowers} = require('../controllers/Users/Follow');
const auth = require('../middlewares/auth');
const {isAuthCandidate, candidateId} = require('../middlewares/candidateAuth');
const {readVisits} = require('../controllers/ViewProfile/viewProfile')
const {readViewPost} = require('../controllers/ViewPost/ViewPost')
const {createBadge, readBadges, updateBadge} = require('../controllers/BadgeCandidates/Badges');
const {createHastag, readHastags} = require('../controllers/Hastags/Hastags');

var cpUpload = upload.single('profile_pic');


route.post('/candidates/singup', createCandidate);
route.get('/candidates', readCandidates);


// route.get('/candidates/list',listCandidate)
route.get('/candidates/:login', getOneCandidate);
route.get('/candidates/list/:candidate_id', auth,isAuthCandidate, getSomeCandidateData);
route.get('/candidates/singout',singout);
route.put('/candidates/update/:candidate_id', auth,isAuthCandidate,updateCandidate)
route.put('/candidates/update/password/:candidate_id', auth,  isAuthCandidate, updatePassword);
route.post('/candidates/singin',singin);
route.delete('/candidates/delete/:candidate_id', auth,isAuthCandidate, removeCandidate);
// ESQECEU SENHA
route.put('/candidates/forgot/password', forgotPassword);
route.get('/password/reset/:token', resetPassword);
route.put('/update/forgot/password',setNewForgotPass)
// numero de seguidores
route.get('/followers/:candidate_id',getFollowers);
// ================================================================
// VER NUMERO DE VISITANTES
route.get('/candidates/visits/:candidate_id',auth,isAuthCandidate,readVisits)
// VER NUMERO DE VISITANTES POR POST
route.get('/candidates/view-post/:candidate_id', auth, isAuthCandidate, readViewPost);
//======================================================================================
// BADGES ROUTE
route.post('/candidates/badges/:badge_id/create/:candidate_id', auth, isAuthCandidate, createBadge);
route.get('/badges', readBadges);
route.put('/badges/update/:candidate_id',auth, isAuthCandidate, updateBadge);
// ===========================================================================================
// HASTAGS

route.post('/hastags/:candidate_id',auth, isAuthCandidate, createHastag);
route.get('/hastags', readHastags);






route.param('candidate_id', candidateId);


module.exports = route;