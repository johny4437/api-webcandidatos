const knex = require('../../database/connection');

exports.likeCreate = async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.params.user_id;

    await knex('likes').select('user_id').where('user_id', user_id)
    .then(userData =>{
        if(userData.length === 0){
            return knex('likes').insert({
                status:true,
                user_id,
                post_id
            }).then(()=>res.status(200).json('liked'))
        }
        return res.status(400).json('Not liked')
    })


               
}
exports.readLikes = (req, res) =>{
    
}