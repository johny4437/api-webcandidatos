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