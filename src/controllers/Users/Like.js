const knex = require('../../database/connection');

exports.likeCreate = async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.params.user_id;
    await knex('likes').insert({
        status:true,
        user_id,
        post_id
    }).then(()=>res.json('liked'))
      .catch(()=>res.json('erro'))

               
}
exports.readLikes = (req, res) =>{
    cons
}