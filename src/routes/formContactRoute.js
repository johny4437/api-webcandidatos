const route = require('express').Router();
const {createContact} = require('../controllers/FormContact/FormController')
route.post('/form/contact', createContact);

module.exports= route;