const knex = require('../../database/connection');

exports.create = async(req, res) => {
    const {badge} = req.body;
    const created_at = Date();

    const newBadge = {
        badge,
        created_at
    }
    console.log(newBadge)
     knex('badges').insert(newBadge)
    .then(data => {
        console.log(data)
        // res.status(200).json({msg:"BADGE CREATED"});
    }).catch(err => res.status(400).json({error:err}));



}

exports.readBadge = (req, res) => {
   
    
    knex('badges').select('*')
    .then(response => {
        res.status(200).json(response);
    }).catch(() => res.status(400).json({error:"THERE ARE NO BADGES"}));



};




