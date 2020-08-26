const knex = require('../../database/connection');

exports.follow = (req, res) => {
    const candidate_id = req.headers.candidate_id;
    const user_id = req.params.user_id;

    knex('followers').select('user_id').where('user_id',user_id)
    .then(userData =>{
        if(userData.length === 0){
            return knex('followers').insert({
                user_id,
                candidate_id,
            }).then(()=>{
                res.status(200).json({msg:"FOLLOWING"})
            })
        }
        return res.status(400).json({msg:"YOU ARE ALREAD FOLLOWING"});
    })
};

exports.unfollow = (req, res) =>{
    const candidate_id = req.headers.candidate_id;
    const user_id =  req.params.user_id;

    knex('followers').select('user_id').where('user_id', user_id)
    .then(userData =>{
        if(userData.length !== 0){
            return knex('followers')
                    .select('*')
                    .where('user_id', user_id)
                    .delete()
                    .then(() =>{
                        res.status(200).json({msg:"UNFOLLOw"})
                    })
        }
        return res.json({msg:"YOU ARE NOT FOLLOWING THIS CANDIDATE"});
    })
}