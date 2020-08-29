const knex = require('knex');


exports.createShareWpp =async (req, res) => {
    const candidate_id = re.headers.candidate_id;
    const user_id = req.headers.user_id

    const view = {
        user_id,
        candidate_id
    }

    await knex('share_whatsapp').insert(view)
    .then(() => {
        res.status(200).json({msg:"SHARED INSERT"})
    }).catch(() =>{
        res.status(400).json({error:"ERROR TO INSERT SHARE"})
    })

}

exports.readShareWpp = async (req, res) => {
    const candidate_id = re.headers.candidate_id;
    
    await knex('share_whatsapp').select('*').where('candidate_id', candidate_id)
    .then(data => {
        res.status(200).json(data)
    }).catch(() =>{
        res.status(400).json({msg:"NO SHARES"})
    })

}