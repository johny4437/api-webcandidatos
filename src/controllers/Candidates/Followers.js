const knex = require('../../database/connection');

exports.followers = async (req,res) =>{

    const candidate_id = req.params.candidate_id;

    knex('followers').select('user_id','id').where('candidate_id', candidate_id)
    .then(data =>{
        if(data.length !== 0){
            res.status(200).json(data)
        }else{
            res.json({msg:"YOU DON'T HAVE FOLLOWERS YET "});
        }
    })
    res.status(200).json({followers});

}