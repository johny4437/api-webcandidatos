const route = require('express').Router();
const  {getState, getCity} = require('../controllers/Address/Address')


route.get('/state', getState);
route.get('/city/:state_id', getCity);
module.exports = route;