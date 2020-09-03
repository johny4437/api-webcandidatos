const knex = require('../../database/connection');

exports.createBadge = (req, res) => {
    const candidate_id = req.params.candidate_id;
    const badge_id = req.headers.badge_id;

    const badge = {
        candidate_id,
        badge_id
    }

    knex('badges_candidates').where('candidate_id', candidate_id)
    .andWhere('badge_id', badge_id)
    .select('*').then(badgeData =>{
        if(badgeData.length === 0){
            return knex('badges_candidates').insert(badge)
            .then(() => {
                res.status(200).json({msg:"BADGE CREATED"})
            }).catch(() => {
                res.status(400).json({error:"ERRO TO INSERT THE BADGE"})
            })
        }else{
            res.status(200).json({msg:"YOU ALREADY HAS THIS BADGE"})
        }
    })
};

exports.readBadges = async (req, res) => {
    const candidate_id =  req.headers.candidate_id;
    // console.log(candidate_id)

  await  knex('badges_candidates').select('badge_id').where('candidate_id', candidate_id)
    .then(data =>{
        if(data.length !== 0){
            res.status(200).json(data)
        }else{
            res.status(404).json({msg:"THIS CANDIDATE HAS NO BADGES"})
        }
       
    })
}
exports.updateBadge = (req,res) => {
    const candidate_id = req.params.candidate_id;
    const id = req.headers.badge_id;
    const { newBadge } = req.body;
    const badge = {
        badge_id: newBadge,
        updated_at:  Date.now()
    }

    knex('badges_candidates').where('candidate_id', candidate_id)
    .andWhere('badge_id', id)
    .select('*').then(badgeData =>{
        if(badgeData.length !== 0){
            return knex('badges_candidates').where('badge_id', id).update(badge)
            .then(() => {
                res.status(200).json({msg:"BADGE UPDATED"})
            }).catch(() => {
                res.status(400).json({error:"ERRO TO UPDATE THE BADGE"})
            })
        }else{
            res.status(200).json({msg:"YOU  HAS NO BADGE"})
        }
    })
};

exports.removeBadge = (req, res) =>{
    
}