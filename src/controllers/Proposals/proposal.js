const knex = require('../../database/connection');

exports.create = async (req, res) => {
    const candidate_id = req.params.candidate_id;
    const { body } = req.body;

    const proposal = {
        body,
        candidate_id
    }

   await  knex('proposals').insert(proposal)
          .then(()=>{
              return res.status(200).json({msg:"PROPOSAL CREATE"})
          })
          .catch(()=>{
              return res.status(400).json({error:"ERRO TO CREATE PROPOSAL"});
          })

    
}