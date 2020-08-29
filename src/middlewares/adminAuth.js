const knex = require('../database/connection');


exports.isAuthAdmin = (req, res, next) => {
    // console.log(req.profile[0].id)
    //  console.log({parms:req.params.user_id})
     if(!(req.profile[0].id == req.params.admin_id)){
         return res.status(400).json({error:"User not authorized"})
     }
     next()
 }





exports.adminId = (req, res, next, id) =>{
    knex('admin').select('id').where('id',id)
    .then(data =>{
        if(!data){
            return res.status(400).json("User Not Found");
        }
         req.profile = data

        // console.log({userInitial:data})

        next();
    })
};

