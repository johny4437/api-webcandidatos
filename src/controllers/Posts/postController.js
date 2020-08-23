const knex = require('../../database/connection');
const Formidable = require('formidable');
var fs = require('fs')



exports.create =  (req, res) => {
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

       post.photo_url = `http://localhost:3333/files/${name}`;
    }

    console.log(post)
    knex('posts').insert(post).then(()=>{
        res.json('certo')
    }).catch((err)=>console.log(err))
 



}
exports.list = async (req, res) =>{
     const id = req.params.id
  console.log(id)
    
}