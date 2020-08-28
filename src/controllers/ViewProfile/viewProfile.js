const kenx = require('../../database/connection');
const knex = require('../../database/connection');

exports.create = (req, res) => {
    const user_id = req.params.user_id;
    const candidate_id = req.headers.candidate_id;
    const visit = {
        user_id,
        candidate_id
    }

    knex('visits').where('user_id',user_id).andWhere('candidate_id',candidate_id).select('*')
    .then(visitData => {
        if(visitData.length !== 0){
            return knex('visits').where('user_id',user_id)
                    .update({
                        number_visits:visitData[0].number_visits + 1
                    }).then(()=>{
                        res.status(200).json({msg:"VISITED"})
                    })
        }else{
            return knex('visits').insert(visit)
            .then(()=>{
                        res.status(200).json({msg:"VISITED FIRST"})
            }).catch(() => {
                        res.status(400).json({error:"ERROR"})
                    })
        }
    })

//     knex('visits').insert(visit)
//     .then(()=>{
//         res.status(200).json({msg:"VISITED"})
//     }).catch(() => {
//         res.status(400).json({error:"ERROR"})
//     })
 }
//CANDIDATO VER QUANTAS VISITAS TEVE NO PERFIL
exports.readVisits = (req, res) => {
    const candidate_id = req.params.candidate_id;

    knex('visits').where('candidate_id',candidate_id).select('id','user_id')
    .then(visitData => {
        if(visitData.length !== 0){
            res.status(200).json(visitData)
        }else{
            res.status(400).json({msg:"THERE ARE NO VISITORS"})
        }
    })
}