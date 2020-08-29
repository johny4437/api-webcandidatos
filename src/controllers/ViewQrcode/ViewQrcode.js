const knex = require('knex');

exports.createViewQrCode = async (req, res) => {
    const candidate_id = req.headers.candidate_id
    const user_id = req.headers.user_id;

    const view = {
        candidate_id,
        user_id
    }

     knex('view_qrcode').insert(view)
    .then(() => {
        res.status(200).json({msg:"QRCODE WAS VIEW"})
    }).catch(() =>{
        res.status(400).json({error:"NOT VIEW"});
    })
}

exports.readViewsQRCode = async (req, res) => {
    const candidate_id = req.headers.candidate_id
    await knex('view_qrcode').select('*').where('candidate_id', candidate_id)
    .then(result => {
        res.status(200).json(result)
    }).catch(() => {
        res.status(400).json({msg:"THERE ARE NO VIEWS"})
    })
}