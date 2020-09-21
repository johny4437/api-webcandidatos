const knex = require('../../database/connection');

exports.likeCreate = async (req, res) => {

    const post_id = req.headers.post_id;
    const user_id = req.params.user_id;
    const type_user = req.params.type_user;
    
    // console.log(req.headers)
    // console.log(req.params)
    // console.log(post_id)
    // console.log(user_id)
    // console.log(type_user)

    if(type_user === 'user'){
      console.log('> user')
      const likes = await knex('likes')
        .select('user_id')
        .where('user_id', user_id)
        .where('post_id', post_id)

      if(likes.length === 0){
        console.log(">> insert")
          return knex('likes').insert({
              status:true,
              user_id,
              post_id
          }).then(()=>res.status(200).json('liked'))
      }else{
        res.status(400).json('YOU ALREADY LIKE IT')
      }
    }else{
      console.log('> candidate')
      const likes = await knex('likes')
        .select('candidate_id')
        .where('candidate_id', user_id)
        .where('post_id', post_id)

      if(likes.length === 0){
        console.log(">> insert")
          return knex('likes').insert({
            status:true,
            candidate_id: user_id,
            post_id
          }).then(()=>res.status(200).json('liked'))
      }else{
        res.status(400).json('YOU ALREADY LIKE IT')
      }
    }          
}

exports.likeCreateCandidate = async (req, res) => {

  const post_id = req.headers.post_id;
  const candidate_id = req.params.candidate_id;
  const type_user = req.params.type_user;
  
  // console.log(req.headers)
  // console.log(req.params)
  // console.log(post_id)
  // console.log(candidate_id)
  // console.log(type_user)

  console.log('> candidate')
  const likes = await knex('likes')
    .select('candidate_id')
    .where('candidate_id', candidate_id)
    .where('post_id', post_id)

  if(likes.length === 0){
    console.log(">> insert")
      return knex('likes').insert({
        status:true,
        candidate_id: candidate_id,
        post_id
      }).then(()=>res.status(200).json('liked'))
  }else{
    res.status(400).json('YOU ALREADY LIKE IT')
  }         
}

exports.likeDelete = async (req, res) => {
  const post_id = req.headers.post_id;
  const user_id = req.params.user_id;
  const type_user = req.params.type_user;

  if(type_user === 'user'){
    //busca o like a ser excluido
    const like = await knex('likes')
      .select('id')
      .where('user_id', user_id)
      .where('post_id', post_id)

    if(like.length > 0){
      return knex('likes')
      .select('id')
      .where('id', like[0].id)
      .delete()
      .then(() =>{
        res.status(200).json({msg:"UNLIKE"})
      })
    }
    return res.json({msg:"YOU ARE NOT LIKE THIS POST"});      
  }else{ //caso seja um candidato que tenha dado o like
    //busca o like a ser excluido
    const like = await knex('likes')
      .select('id')
      .where('candidate_id', user_id)
      .where('post_id', post_id)
      
    if(like.length > 0){
      return knex('likes')
      .select('id')
      .where('id', like[0].id)
      .delete()
      .then(() =>{
        res.status(200).json({msg:"UNLIKE"})
      })
    }
    return res.json({msg:"YOU ARE NOT LIKE THIS POST"}); 
  }      
}

exports.likeDeleteCandidate = async (req, res) => {
  const post_id = req.headers.post_id;
  const candidate_id = req.params.candidate_id;
  const type_user = req.params.type_user;

   //busca o like a ser excluido
   const like = await knex('likes')
   .select('id')
   .where('candidate_id', candidate_id)
   .where('post_id', post_id)
   
 if(like.length > 0){
   return knex('likes')
   .select('id')
   .where('id', like[0].id)
   .delete()
   .then(() =>{
     res.status(200).json({msg:"UNLIKE"})
   })
 }
 return res.json({msg:"YOU ARE NOT LIKE THIS POST"});     
}

exports.readLikes = (req, res) =>{
    const post_id = req.headers.post_id;
    knex('likes').select('*').where('post_id', post_id)
    .then(data => {
        res.status(200).json(data)
    })
}