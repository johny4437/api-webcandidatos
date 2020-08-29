const route = require('express').Router();
const {createShareWpp, readShareWpp} = require('../controllers/ShareWhatsapp/ShareWhatsapp');

route.post('/share-wp/create',createShareWpp);
route.get('/view-shares', readShareWpp )
module.exports = route;