const knex = require('../../database/connection');
const { andWhere } = require('../../database/connection');

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

    
};

exports.read = (req, res) => {
    const candidate_id = req.headers.candidate_id;

    knex('proposals').where('candidate_id',candidate_id).select('id','body')
    .then(proposal => {
        res.status(200).json(proposal)
    }).catch(() =>{
        res.status(400).json({error:"NO PROPOSALS"})
    })
}



exports.update = (req, res) => {
    const candidate_id = req.params.candidate_id;
    const { body } = req.body;
    const proposal_id = req.headers.proposal_id;


    const proposal = {
        body,
        candidate_id
    }

    knex('proposals').select('*').where('id', proposal_id).andWhere('candidate_id', candidate_id)
    .then(data =>{
        if(data.length !== 0){
            return knex('proposals').where('id', proposal_id).update('body',body)
                    .then(() =>{
                        res.status(200).json({msg:"PROPOSAL UPDATED"})
                    })
        }else{
            return res.json({msg:"THERE IS NO PROPOSAL TO UPDATE"});
        }
    })
}
exports.remove = (req, res) => {
    const candidate_id = req.params.candidate_id;
    const proposal_id = req.headers.proposal_id;


    knex('proposals').select('*').where('id',proposal_id).andWhere('candidate_id', candidate_id)
    .then(data => {
        if(data.length !== 0){
            return knex('proposals').where('id',proposal_id).delete()
            .then(() =>{
                res.status(200).json({});
            })

        }else{
            return res.status(404).json({error:"ERROR TO DELETE, VERIFY IF YOU ARE ABLE"});
        }
    })
}