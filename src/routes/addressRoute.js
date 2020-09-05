const route = require('express').Router();
const  {getState, getCity, getStateName, getCityName} = require('../controllers/Address/Address')


route.get('/state', getState);
route.get('/city/:state_id', getCity);

//rotas que retornam os nomes dos estados e das cidades passadas
route.get('/state/:id', getStateName);
route.get('/city/:id/name', getCityName);
module.exports = route