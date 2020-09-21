const knex = require('../../database/connection');
const Formidable = require('formidable');
var fs = require('fs')
const path = require('path')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})


// CRIAR POST

exports.createPost =  (req, res) => {
    const candidate_id = req.params.candidate_id; 
    const { title, description } = req.body;

    const post = {
        title,
        description,
        candidate_id
    }

    //console.log(req.files)

    if(req.files){
        let path = '';
        let name = '';
        req.files.forEach(function(files,index, arr){
            path = path + files.path + ','
            name = name + process.env.HOST_URL +"/"+ files.filename + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        name = name.substring(0, name.lastIndexOf(","))
        
        post.photo = path;

        post.photo_url = name;
    }else{
      
    }

    knex('posts').insert(post).then(()=>{
        res.json({msg:"POST CREATE"})
    }).catch((err)=>{
      
    })
 



}

// UPDATE POST
exports.updatePost =  (req, res) => {
    const candidate_id = req.params.candidate_id; 
    const post_id = req.headers.post_id
    const { title, description } = req.body;

 

    const post = {
        title,
        description,
        candidate_id
    }


    //console.log(req.files)

    if(req.files){
        let path = '';
        let name = '';
        req.files.forEach(function(files,index, arr){
            path = path + files.path + ','
            name =  name + files.filename + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        name = name.substring(0, name.lastIndexOf(","))
        
        post.photo = path;

       post.photo_url = `${process.env.HOST_URL}/${name}`;
    }

    knex('posts').where('candidate_id', candidate_id).andWhere('id', post_id).update(post).then(()=>{
        res.json('certo')
    }).catch((err)=>console.log(err))
 }

 //LISTA TODOS OS POSTS PARA UM CANDIDATO ESPECIFICO

 exports.listAllPosts = (req, res) =>{
     const id = req.params.candidate_id;
     knex('posts')
      .select('title','description','id', 'photo_url', 'createdAt')
      .where('candidate_id', id)
      .orderBy('id', 'desc')
        .then(data =>{
           res.json(data)
        })
}

exports.listAllPostsLogin = async (req, res) =>{
  const login = req.params.login

  try {
    const candidate = await knex('candidates').where('login', login).select('id')

    const id = candidate[0].id

    knex('posts')
      .select('title','description','id', 'photo_url', 'createdAt')
      .where('candidate_id', id)
      .orderBy('id', 'desc')
        .then(data =>{
            res.status(200).json(data)
        })

  } catch (error) {
    res.status(400).json({msg:"Erro ao carregar publicações"})
  }
  
}

exports.countNumLikes = async (req, res) =>{
  const post_id = req.params.post_id

  knex('likes').select('id').where('post_id', post_id)
  .then(result => {    
      res.status(200).json(result.length)
  }).catch((error) => {
      res.status(404).json({msg:"YOU DONT HAVE LIKES"})
  })  
}

exports.postIsLiked = async (req, res) =>{
  const post_id = req.params.post_id
  const user_id = req.params.user_id
  const type_user = req.params.type_user

  if(type_user === 'user'){
    knex('likes').select('id')
      .where('post_id', post_id)
      .where('user_id', user_id)
      .then(result => {    
        if(result.length > 0){
          res.status(200).json(true)  
        }else{
          res.status(400).json(false)  
        }
      }).catch((error) => {
          res.status(404).json({msg:"YOU DONT HAVE LIKES"})
      }) 
  }else{ //post curtido por um candidato
    knex('likes').select('id')
      .where('post_id', post_id)
      .where('candidate_id', user_id)
      .then(result => {    
        if(result.length > 0){
          res.status(200).json(true)  
        }else{
          res.status(400).json(false)  
        }
      }).catch((error) => {
          res.status(404).json({msg:"YOU DONT HAVE LIKES"})
      }) 
  }
   
}

exports.removePost = (req, res) => {
    const id = req. params.candidate_id;
    const post_id = req.headers.post_id
    knex('posts').where('candidate_id', id).andWhere('id', post_id).delete()
    .then(() => {
        res.status(200).json()
    }).catch(() =>{
        res.status(400).json({msg:"THERE ARE NO POSTS TO DELETE"})
    })
}
