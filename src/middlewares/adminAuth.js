const knex = require('../database/connection');


exports.isAuthAdmin = (req, res, next) => {
    // console.log(req.profile[0].id)
    //  console.log({parms:req.params.user_id})
     if(!(req.profile == req.params.admin_id || req.role == "1")){
         return res.status(400).json({error:"User not authorized"})
     }
     next()
 }





exports.adminId = async (req, res, next, id) =>{
   const response = await  knex('admin').select('id','role').where('id',id);
   req.profile = response[0].id;
   req.role = response[0].role;

   next();

};

