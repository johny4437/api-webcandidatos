const knex = require('../../../database/connection');

exports.create = (req, res) => {
    const badge = req.body.badge;
    
    knex('badges').insert({badge})
    .then(() => {
        res.status(200).json({msg:"BADGE CREATED"});
    }).catch(() => res.status(400).json({error:"ERRO TO CREATE A BADGE"}));



}