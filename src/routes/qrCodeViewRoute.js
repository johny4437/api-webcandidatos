const route = require('express').Router();
const {createViewQrCode, readViewsQRCode} = require('../controllers/ViewQrcode/ViewQrcode');

route.post('/view/create',createViewQrCode);
route.get('/view-qrcode', readViewsQRCode )
module.exports = route;