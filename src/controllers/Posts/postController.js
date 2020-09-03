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
            name =  name + files.filename + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        name = name.substring(0, name.lastIndexOf(","))
        
        post.photo = path;

       post.photo_url = process.env.HOST_URL +"/"+name;
    }

    console.log(post)
    knex('posts').insert(post).then(()=>{
        res.json({msg:"POST CREATE"})
    }).catch((err)=>console.log(err))
 



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

       post.photo_url = `http://localhost:3333/files/${name}`;
    }

    console.log(post)
    knex('posts').where('candidate_id', candidate_id).andWhere('id', post_id).update(post).then(()=>{
        res.json('certo')
    }).catch((err)=>console.log(err))
 }

 //LISTA TODOS OS POSTS PARA UM CANDIDATO ESPECIFICO

 exports.listAllPosts = (req, res) =>{
     const id = req. params.candidate_id;
     knex('posts').select('title','description','id').where('candidate_id', id)
        .then(data =>{
           res.json(data)
        })
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
