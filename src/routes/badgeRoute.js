const route = require('express').Router();
const {create} = require('../controllers/Admin/Badges/Badges');

route.post('/badges/create', create);


module.exports = route;