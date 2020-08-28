const knex = require('../../database/connection');

exports.create = (req, res) => {
    const user_id = req.params.user_id;
    const proposal_id = req.headers.proposal_id;
    

        const view = {
            user_id,
            proposal_id, 
        
        }

    knex('view_proposal').insert(view)
    .then(() => {
        res.status(200).json({msg:"VIEW PROPOSAL SUCESSFULLY"})
    }).catch(() => {
        res.status(400).json({error:"ERRO TO SAVE VIEW PROPOSAL"})
    })
}
exports.readViewProposal = (req, res) => {
    const proposal_id = req.headers.proposal_id;
    const candidate_id = req.params.candidate_id;

    knex('view_proposal').where('id', proposal_id).select('*')
    .then(proposalData =>{
        if(proposalData.length !== 0){
            res.status(200).json(proposalData)
        }else{
            res.status(400).json({msg:"THERE ARE NO VIEWS ON THIS PROPOSAL"})
        }
    })
}