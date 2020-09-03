const knex = require('../../database/connection');

exports.createComments =async (req, res) => {
    const post_id =  req.headers.post_id;
    const user_id = req.params.user_id;
    const { body } = req.body;

    const comment = {
        post_id,
        user_id,
        body
    }

  await  knex('comments').insert(comment)
    .then(()=>res.status(200).json({msg:"COMMENT CREATED"}))
    .catch(()=> res.status(400).json({msg:"NOT COMMENTED"})) 
    
}
exports.readComments = async (req, res) => {
    const post_id = req.headers.post_id;
    knex('comments').select('id','body').where('post_id', post_id)
    .then(data =>{
        if(data.length !== 0){
            res.status(200).json(data)
        }else{
            res.status(400).json({msg:"THERE ARE NO COMMENTS IN THIS POST YET."})
        }
    })
};

exports.updateComments = (req, res) => {
    const post_id = req.headers.post_id;
    const user_id = req.params.user_id;
    const comment_id = req.headers.comment_id;
    const { body } = req.body;
    knex('comments').select('*').where('post_id', post_id).andWhere('user_id', user_id)
    .then(data =>{
        if(data.length !== 0){
           return knex('comments').where('id',comment_id).update('body', body)
            .then(()=>res.status(200).json({msg:"COMMENT UPDATED"}))
        }else{
            return res.json({msg:"COMMENT NOT UPDATED"})
        }
    })
};

exports.deleteComments = (req,res) =>{
    const post_id = req.headers.post_id;
    const user_id = req.params.user_id;
    const comment_id = req.headers.comment_id;

    knex('comments').select('*').where('post_id', post_id).andWhere('user_id', user_id)
    .then(data =>{
        if(data.length !== 0){
           return knex('comments').where('id',comment_id).delete()
            .then(()=>res.status(200).json())
        }else{
            return res.json({msg:"COMMENT NOT DELETED"})
        }
    })
}