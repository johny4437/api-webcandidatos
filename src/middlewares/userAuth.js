const knex = require('../database/connection');


exports.isAuth = (req, res, next) => {
   	console.log(req.role)
    // console.log({parms:req.params.user_id})
    if(req.profile !== req.params.user_id || req.role!=="0"  ){
        return res.status(400).json({error:"User not authorized"})
    }
    next()
}






exports.userId = async (req, res, next, id) =>{
const response = await knex('users').select('id', 'role').where('id',id);
if(response.length === 0){
	 return res.status(400).json("User Not Found");
}
req.profile = response[0].id;
req.role =  response[0].role




next();
};

