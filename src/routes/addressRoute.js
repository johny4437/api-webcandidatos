const route = require('express').Router();
const  {getState} = require('../controllers/Address/Address')


route.get('/state', getState);

module.exports = route