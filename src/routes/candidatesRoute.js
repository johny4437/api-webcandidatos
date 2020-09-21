const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);

const knex = require('../database/connection');
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
    updateProfilePic,
    setNewForgotPass,
    removeProfilePic,
    removeCoverPic,
    listCandidatesCity,
    searchCandidates,
    loginSite
    
} = require('../controllers/Candidates/candidateController');
const {
  getFollowers,
  getFollowersCount,
  isFollower,
  follow,
  unfollow
} = require('../controllers/Users/Follow');
const auth = require('../middlewares/auth');
const {isAuthCandidate, candidateId} = require('../middlewares/candidateAuth');
const {readVisits} = require('../controllers/ViewProfile/viewProfile')
const {readViewPost} = require('../controllers/ViewPost/ViewPost')
const {createBadge, readBadges, updateBadge} = require('../controllers/BadgeCandidates/Badges');
const {createHastag, readHastags} = require('../controllers/Hastags/Hastags');

var profilePicUpload = upload.single('profile_pic');
var coverPicUpload = upload.single('cover_pic');
const path = require('path')

require('dotenv').config({path:path.resolve (__dirname ,'..', '.env')})


route.post('/candidates/singup', createCandidate);

// route.post('/candidates/singup', (req, res) => {
//   console.log('field: '+req.body.email)
// });

route.get('/candidates', readCandidates);


route.get('/candidates/list/city/:city_id/:role?', listCandidatesCity)
route.get('/candidates/search/:name/:city_id/:role?', searchCandidates)
route.get('/candidates/:login', getOneCandidate);
route.get('/candidates/list/:candidate_id', auth,isAuthCandidate, getSomeCandidateData);
route.get('/candidates/singout',singout);
route.put('/candidates/update/:candidate_id', auth,isAuthCandidate,updateCandidate)
route.put('/candidates/update/password/:candidate_id', auth,  isAuthCandidate, updatePassword);
route.post('/candidates/update/profile_pic/:candidate_id', auth, isAuthCandidate, (req, res) => {
  profilePicUpload(req, res, async (err) => {
    
    if(!err){
      //faz a atualização do usuário
      const id = req.params.candidate_id;

      try {
        const candidate = {
          id,
          profile_pic: `${process.env.HOST_URL}/${req.file.filename}`,
          updated_at: new Date(),
        }
        //console.log(candidate)
        await knex('candidates').select('id')
          .where('id', id)
          .update(candidate)
  
        res.status(200).json({message:"Foto atualizada com sucesso!"})
      } catch (error) {
        //console.log(error)
        res.status(400).json("Erro ao atualizar foto "+error) 
      }
    }       
  });
})

route.post('/candidates/update/cover_pic/:candidate_id', auth, isAuthCandidate, (req, res) => {
  coverPicUpload(req, res, async (err) => {

    if(!err){
      //faz a atualização do usuário
      const id = req.params.candidate_id;

      try {
        const candidate = {
          id,
          cover_pic: `${process.env.HOST_URL}/${req.file.filename}`,
          updated_at: new Date(),
        }
        //console.log(candidate)
        await knex('candidates').select('id')
          .where('id', id)
          .update(candidate)
  
        res.status(200).json({message:"Foto atualizada com sucesso!"})
      } catch (error) {
        //console.log(error)
        res.status(400).json("Erro ao atualizar foto "+error) 
      }
    }       
  });
})

route.delete('/candidates/update/profile_pic/remove/:candidate_id', auth, isAuthCandidate, removeProfilePic)
route.delete('/candidates/update/cover_pic/remove/:candidate_id', auth, isAuthCandidate, removeCoverPic)

route.post('/candidates/singin',singin);
route.post('/candidates/login_site',loginSite);
route.delete('/candidates/delete/:candidate_id', auth,isAuthCandidate, removeCandidate);
// ESQECEU SENHA
route.put('/candidates/forgot/password', forgotPassword);
route.get('/password/reset/:token', resetPassword);
route.put('/update/forgot/password',setNewForgotPass)

// numero de seguidores
route.get('/followers/:candidate_id',getFollowers);
route.get('/followers/count/:login',getFollowersCount);
route.get('/followers/is_follower/:login/:user_id/:type_user',isFollower);
route.get('/followers/follow/:login/:user_id/:type_user',follow);
route.get('/followers/unfollow/:login/:user_id/:type_user',unfollow);

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