const knex = require('../../database/connection');
const { insert } = require('../../database/connection');

exports.create = (req, res) => {
    const user_id = req.params.user_id;
    const post_id = req.headers.post_id;

    const view = {
        user_id,
        post_id,
        view_at:new Date()
    }

        knex('view_post').insert(view)
            .then(() => {
                res.status().json({msg:"VIEW INSERTED"})
            }).catch(() => {
                res.status(400).json({error:"ERROR TO INSERT"})
            })
        
    
};

exports.readViewPost = (req, res) => {
    const post_id = req.headers.post_id;
    const candidate_id = req.params.candidate_id;

    knex('view_post').select('*').where('post_id', post_id)
    .then(dataView => {
        if(dataView.length !== 0){
            
             res.status(200).json(dataView)
        }else{
            res.status(400).json({msg:"THERE ARE NO VIEWS"})
        }
    })
}