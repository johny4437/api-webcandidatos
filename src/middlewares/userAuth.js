const knex = require('../database/connection');


exports.isAuth = (req, res, next) => {
   console.log(req.role)
    // console.log({parms:req.params.user_id})
    if(req.profile[0].id !== req.params.user_id && req.role !== "0" ){
        return res.status(400).json({error:"User not authorized"})
    }
    next()
}






exports.userId = async (req, res, next, id) =>{
const response = await knex('users').select('id').where('id',id);
req.profile = response[0].id;


const defined_role = await  knex('roles').select('roles').where('user_id', response[0].id);
req.role = defined_role[0].roles;

next();
};

