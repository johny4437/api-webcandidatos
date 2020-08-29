const route = require('express').Router();
const {create} = require('../controllers/Badges/Badges');

route.post('/badges/create', create);


module.exports = route;