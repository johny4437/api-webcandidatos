const knex = require('../database/connection');


exports.isAuthCandidate = (req, res, next) => {
    // console.log(req.profile[0].id)
    //  console.log({parms:req.params.user_id})
     if(!(req.profile == req.params.candidate_id || req.role == "1")){
         return res.status(400).json({error:"User not authorized"})
     }
     next()
 }





exports.candidateId = async (req, res, next, id) =>{
   const response =  await knex('candidates').select('id','role').where('id',id);
    
        if(!response.length === 0){
            return res.status(400).json("User Not Found");
        }else
         req.profile = response[0].id;
         req.role = response[0].role

      

        next();
    
};

