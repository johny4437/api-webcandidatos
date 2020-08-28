const knex = require('../../database/connection');

exports.create = (req, res) => {
    const user_id = req.params.user_id;
    const post_id = req.headers.post_id;

    const view = {
        user_id,
        post_id,
        number_views:1,
        view_at:new Date()
    }

    knex('view_post').where('user_id', user_id).andWhere('post_id', post_id).select('*')
    .then(viewData => {
        if(viewData.length !== 0){
            return knex('view_post').where('post_id',post_id).andWhere('user_id',user_id)
            .update({
                number_views: viewData[0].number_views + 1,
                view_at: new Date()
            }).then(() => {
                res.status(200).json({msg:"NUMBER VIEWs UPDATED"})
            })
        }else{
            return knex('view_post').insert(view)
            .then(() => {
                res.status().json({msg:"VIEW FIRST"})
            }).catch(() => {
                res.status(400).json({error:"ERROR TO INSERT"})
            })
        }
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