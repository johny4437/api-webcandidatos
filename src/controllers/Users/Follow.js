const knex = require('../../database/connection');

exports.follow = async (req, res) => {
  const login = req.params.login
  const user_id = req.params.user_id
  const type_user = req.params.type_user //tipo do usuário que está fazendo a consulta, candidate ou user

  const candidate = await knex('candidates')
      .select("id")
      .where('login', login)

  if(type_user === 'user'){ //usuário normal
    knex('followers').select('user_id').where('user_id',user_id).andWhere('candidate_id', candidate[0].id)
      .then(userData =>{
          if(userData.length === 0){
              return knex('followers').insert({
                  user_id,
                  candidate_id: candidate[0].id,
              }).then(()=>{
                  res.status(200).json({msg:"FOLLOWING"})
              })
          }
          return res.status(400).json({msg:"YOU ARE ALREAD FOLLOWING"});
      })
  }else{
    knex('followers').select('user_id').where('candidate',user_id).andWhere('candidate_id', candidate[0].id)
      .then(userData =>{
          if(userData.length === 0){
              return knex('followers').insert({
                  candidate: user_id,
                  candidate_id: candidate[0].id,
              }).then(()=>{
                  res.status(200).json({msg:"FOLLOWING"})
              })
          }
          return res.status(400).json({msg:"YOU ARE ALREAD FOLLOWING"});
      })
  }
  
};

exports.unfollow = async (req, res) =>{
  const login = req.params.login
  const user_id = req.params.user_id
  const type_user = req.params.type_user //tipo do usuário que está fazendo a consulta, candidate ou user

  const candidate = await knex('candidates')
    .select("id")
    .where('login', login)

  if(type_user === 'user'){ //usuário normal
    knex('followers').select('user_id').where('user_id', user_id).andWhere('candidate_id', candidate[0].id)
      .then(userData =>{
          if(userData.length !== 0){
              return knex('followers')
                      .select('*')
                      .where('user_id', user_id)
                      .delete()
                      .then(() =>{
                          res.status(200).json({msg:"UNFOLLOw"})
                      })
          }
          return res.json({msg:"YOU ARE NOT FOLLOWING THIS CANDIDATE"});
      })
  }else{ //candidato
    knex('followers').select('user_id').where('candidate', user_id).andWhere('candidate_id', candidate[0].id)
      .then(userData =>{
          if(userData.length !== 0){
              return knex('followers')
                      .select('*')
                      .where('candidate', user_id)
                      .delete()
                      .then(() =>{
                          res.status(200).json({msg:"UNFOLLOw"})
                      })
          }
          return res.json({msg:"YOU ARE NOT FOLLOWING THIS CANDIDATE"});
      })
  }
    
}

// PEGAR SEGUIDORES DE UM CANDIDATO ESPECIFICO

exports.getFollowers = (req, res) => {
    const candidate_id = req.params.candidate_id
    knex('followers').select('*').where('candidate_id', candidate_id)
    .then(result => {
        res.status(200).json(result)
    }).catch(() => {
        res.status(404).json({msg:"YOU DONT HAVE FOLLOWERS"})
    })
}

exports.getFollowersCount = async (req, res) => {
  const login = req.params.login

  const candidate = await knex('candidates')
    .select("id")
    .where('login', login)
  
  knex('followers').select('*').where('candidate_id', candidate[0].id)
  .then(result => {    
      res.status(200).json(result.length)
  }).catch((error) => {
    console.log(error)
      res.status(404).json({msg:"YOU DONT HAVE FOLLOWERS"})
  })
}

exports.isFollower = async (req, res) => {
  const login = req.params.login
  const user_id = req.params.user_id
  const type_user = req.params.type_user //tipo do usuário que está fazendo a consulta, candidate ou user

  const candidate = await knex('candidates')
    .select("id")
    .where('login', login)
  if(type_user === 'user'){ //consulta normal
    knex('followers').select('*')
    .where('candidate_id', candidate[0].id)
    .where('user_id', user_id)
    .then(result => {
        if(result.length > 0){
          res.status(200).json(true)  
        }else{
          res.status(400).json(false)  
        }
    }).catch((error) => {
      console.log(error)
        res.status(404).json({msg:"YOU DONT HAVE FOLLOWERS"})
    })
  }else{ //caso seja candidato
    knex('followers').select('*')
    .where('candidate_id', candidate[0].id)
    .where('candidate', user_id) //pega na coluna do id do candidato que segue outro candidato
    .then(result => {    
      if(result.length > 0){
        res.status(200).json(true)  
      }else{
        res.status(400).json(false)  
      }
    }).catch((error) => {
      console.log(error)
        res.status(404).json({msg:"YOU DONT HAVE FOLLOWERS"})
    })
  }
  
}