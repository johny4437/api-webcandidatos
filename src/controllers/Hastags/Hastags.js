const knex = require('../../database/connection');
const { hash } = require('bcryptjs');

exports.createHastag = (req, res) => {
    const {hastag} = req.body;
    const candidate_id = req.params.candidate_id;

   

    const hastagData = {
        hastag,
        candidate_id
    }

    knex('hastags').select('*').where('hastag', hastag)
      .then(data => {
          if(data.length === 0){
              return knex('hastags').insert(hastagData)
              .then(() =>{
                  res.status(200).json({msg:"HASTAG CREATED"})
              })
          }else{
              res.status(404).json({msg:"HASTAG ALREADY EXISTS"})
          }
      })
};

exports.readHastags = (req, res) => {
    knex('hastags').select('hastag').then(dataHastag => {
        res.status(200).json(dataHastag)
    }).catch(err => res.status(400).json(err))
}

//carrega as hastags utilizadas no perfil de um candidato
exports.getHashtagsCandidate = async (req, res) => {
  //console.log('get hashtags user '+req.params.login)

  //primeiro pega o id do usuário pelo login
  const candidate = await knex('candidates')
    .select('id')
    .where({ login: req.params.login })
    .then(dataCandidate => {
      //console.log(dataCandidate)
      const hashtags = knex('hastags')
        .select('hastag')
        .where({ candidate_id: dataCandidate[0].id })
        .then(hashtags => {
          res.status(200).json(hashtags)
        })
        .catch(err => res.status(400).json(err))

    })
    .catch(err => res.status(400).json(err))

  
}