const knex = require('../../database/connection');

exports.create = (req, res) => {
    const candidate_id = req.params.candidate_id;

    const {title, description} = req.body;
    
  
        let path = '';
        req.files.forEach((files,index, arr) => {
            path = path + files.path + ','
        })

        path = path.substring(0, lastIndexOf(','));

        const photo = path;
        knex('posts').insert({
            title,
            photo,
            description,
            candidate_id
    })
        


    

    
    
        
    
}