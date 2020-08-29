const knex = require('../../database/connection');

exports.createViewHastag = async (req, res) => {
    const user_id = req.params.user_id;
    const hastag_id = req.headers.hastag_id;

    const view = {
        user_id, 
        hastag_id
    }

   await knex('view_hastags').insert(view)
    .then(() =>{
        res.status(200).json({msg:"HASTAG VISUALIZED"})
    }).catch(() => {
        res.status(400).json({msg:"HASTAG NOT VISUALIZED"})
    })
    
 }