const knex = require('../database/connection');


exports.isAuth = (req, res, next) => {
   // console.log(req.profile[0].id)
    console.log({parms:req.params.user_id})
    if(!(req.profile[0].id == req.params.user_id)){
        return res.status(400).json({error:"User not authorized"})
    }
    next()
}






exports.userId = async (req, res, next, id) =>{
await knex('users').select('id').where('id',id)
    .then(data =>{
        if(!data){
            return res.status(400).json("User Not Found");
        }
         req.profile = data

        //console.log(data)

        next();
    })
};

