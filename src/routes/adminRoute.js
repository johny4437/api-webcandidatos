const route = require('express').Router();
const multerConfig = require('../config/multer');
const multer = require('multer')
var upload = multer(multerConfig);
const auth = require('../middlewares/auth');
const {isAuthAdmin, adminId} = require('../middlewares/adminAuth');
const { userId} = require('../middlewares/userAuth');
const { candidateId} = require('../middlewares/candidateAuth');
const {createCandidate, updateCandidate, removeCandidate, singin} = require('../controllers/Candidates/candidateController');
const {createUser, updateUser} = require('../controllers/Users/users');
const {createAdmin, singinAdmin, test} = require('../controllers/Admin/Admin')

// ============================================================================================
// ADMIN ROUTE
route.post('/admin/create', createAdmin);
route.post('/admin/singin',singinAdmin);





// ============================================
// CANDIDATE ROUTE

var cpUpload = upload.fields([{name:'profile_pic', maxCount:1},
 {name:'cover_pic', maxCount:1},{name:'doc_selfie', maxCount:1},{name:'doc_identity', maxCount:1},
 {name:'doc_files_candidate', maxCount:1}]);

route.post('/admin/:admin_id/candidates/create', auth, isAuthAdmin,cpUpload ,createCandidate);
route.put('/admin/:admin_id/candidates/:candiate_id/update', auth,isAuthAdmin, updateCandidate);
route.delete('/admin/:admin_id/candidates/:candiate_id/remove', auth, isAuthAdmin, removeCandidate);

// ===============================================================================
// USER ROUTES

route.post('/admin/:admin_id/users/create/', auth, isAuthAdmin,upload.single('photo'),createUser);
route.put('/admin/:admin_id/users/:user_id/update', auth,isAuthAdmin, upload.single('photo'),updateUser);


route.param('admin_id', adminId);
route.param('user_id', userId);
route.param('candidate_id', candidateId);
module.exports=route;