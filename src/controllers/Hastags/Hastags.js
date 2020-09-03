const knex = require('../../database/connection');

exports.createHastag = (req, res) => {
    const {hastag} = req.body;
    const candidate_id = req.params.candidate_id;

   

    const hastagData = {
        hastag,
        candidate_id
    }

    knex('hastags').select('*').where('hastag', hastag)
    .then(data => {
        if(data.length === 0){
            return knex('hastags').insert(hastagData)
            .then(() =>{
                res.status(200).json({msg:"HASTAG CREATED"})
            })
        }else{
            res.status(404).json({msg:"HASTAG ALREADY EXISTS"})
        }
    })
};

exports.readHastags = (req, res) => {
    knex('hastags').select('hastag').then(dataHastag => {
        res.status(200).json(dataHastag)
    }).catch(err => res.status(400).json(err))
}