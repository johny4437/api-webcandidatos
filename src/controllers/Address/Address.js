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