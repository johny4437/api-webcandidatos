const route = require('express').Router();
const {create, readBadge} = require('../controllers/Badges/Badges');

route.post('/badge/create', create);
route.get('/badge/list', readBadge);


module.exports = route;