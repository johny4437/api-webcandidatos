const knex = require('../../database/connection');

exports.create = (req, res) => {
    const candidate_id = req.headers.candidate_id;
    const user_id = req.params.user_id;

    knex('favorites').select('*').where('user_id',user_id).andWhere('candidate_id',candidate_id)
    .then(userData =>{
        if(userData.length === 0){
            return knex('favorites').insert({user_id, candidate_id})
            .then(() => {
                res.status(200).json({msg:"ADD TO FAVORITES"})
            })
        }else{
            return res.status(400).json({msg:"ALREADY YOUR FAVORITE"})
        }
    })
};

exports.read = (req, res) => {
    const user_id = req.params.user_id;
    knex('favorites').where('user_id',user_id).select('id','candidate_id')
    .then( favoriteData =>{
        if(favoriteData.length !== 0) {
            res.status(200).json(favoriteData);
        }else{
            res.status(400).json({error:"THERE ARE NO FAVORITES"});
        }
        
    })
}

exports.remove = (req, res) => {
    const user_id = req.params.user_id;
    const candidate_id = req.headers.candidate_id;
    const favorite_id = req.headers.favorite_id;

    knex('favorites').select('*').where('id',favorite_id).andWhere('user_id',user_id)
    .then(favoriteData =>{
        if(favoriteData.length !== 0){
             return knex('favorites').where('id',favorite_id).delete()
            .then(() =>{ res.status(200).json()})
        }else{
            res.status(400).json({msg:"NO FAVORITES TO DELETE"})
        }
    })
}