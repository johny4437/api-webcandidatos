const knex = require('../database/connection');
exports.userId = (req, res, next, id) =>{
    knex('candidates').select('id').where('id',id)
    .then(data =>{
        if(!data){
            return res.status(400).json("User Not Found");
        }
        req.user = data.id

        next();
    })
};

exports.isAuth = (req, res, next) => {
    console.log(req.user)
    if(!(req.user == req.params.candidate_id)){
        return res.status(400).json({error:"User not authorized"})
    }
    next()
}