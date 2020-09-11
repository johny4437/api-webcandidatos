const route = require('express').Router();
const  {getHashtagsCandidate} = require('../controllers/Hastags/Hastags')


route.get('/hashtags/user/:login', getHashtagsCandidate);

module.exports = route