const knex = require('../../database/connection')

exports.getState = async(req, res) => {
    await knex('estados').select('*')
    .then(data => {
        if(data.length !== 0){
            res.status(200).json(data)
        }else{
            res.status(404).json("ERROR TO RETURN STATE")
        }
    })
}

exports.getStateName = async(req, res) => {
  await knex('estados')
          .select('*')
          .where('id', req.params.id)
          .then(data => {
              if(data.length !== 0){
                  res.status(200).json(data)
              }else{
                  res.status(404).json("ERROR TO RETURN STATE")
              }
          })
}

exports.getCity = async(req, res) => {
     
    const state_id = req.params.state_id;
    await  knex('cidades').select('*').where('estado_id', state_id)
    .then(cityData => {
        if(cityData.length !== 0) {
            res.status(200).json(cityData);
        }else{
            res.status(404).json("ERROR TO GET CITY")
        }
    })
}

exports.getCityName = async(req, res) => {
  await knex('cidades')
          .select('*')
          .where('id', req.params.id)
          .then(cityData => {
              if(cityData.length !== 0) {
                  res.status(200).json(cityData);
              }else{
                  res.status(404).json("ERROR TO GET CITY")
              }
          })
}

exports.getStateAndCityName = async(req, res) => {
  //carrega os dados da cidade 
  //console.log("id "+req.params.id)
  knex('cidades')
      .select('*')
      .where('id', req.params.id)
      .then(cityData => {
          if(cityData.length !== 0) {
            //getEstado(cityData.estado_id, cityData.cidade)

            //console.log('estado ', cityData.estado_id)
            //console.log('cidade ', cityData.cidade)
            //res.status(200).json(cityData);
            knex('estados')
              .select('estado')
              .where('id', cityData.estado_id)
              .then(stateData => {
                  if(stateData.length !== 0){
                      res.status(200).json({
                        data: `${cityData.cidade}, ${stateData.estado}`
                      })
                  }else{
                      res.status(404).json("ERROR TO RETURN STATE")
                  }
              })
          }else{
              res.status(404).json("ERROR TO GET CITY")
          }
      })
  
  
}