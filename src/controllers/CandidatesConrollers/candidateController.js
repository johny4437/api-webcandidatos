var QRCode = require('qrcode');
const knex = require('../../database/connection');
const crypto = require('crypto')
const {hashPassword} = require('../../utils/passwordHash');
const {generateQR}= require('../../utils/qrGenerator');

require('dotenv').config({path:'../../.env'})


exports.create = (req, res) =>{


    
        const hash = hashPassword(req.body.password);
        const password = hash.hash;
        const id = crypto.randomBytes(4).toString('HEX');

        const {
            name,
            email,
            number,
            party,
            coalition,
            city,
            state,
            cpf,
            description,
          } = req.body;
    
          const files = req.files;
          let { profile_pic, cover_pic } = files;
          
          console.log(profile_pic)
          const text = `http://192.168.0.110:3333/candidates/${id}`
          const qrcode =    generateQR(text)

        

         
        
          const candidate = {
            id,
            name,
            email,
            password,
            number,
            party,
            coalition,
            city,
            state,
            cpf,
            description,
            profile_pic: profile_pic[0].filename,
            url_profile_pic:`http://192.169.0.110/files/${profile_pic[0].filename}`,
            cover_pic: cover_pic[0].filename,
            url_cover_pic:`http://192.168.0.110/files/${cover_pic[0].filename}`,
            status: 'actived', //actived | deactived | verified
            qrcode:qrcode,
            date: new Date()
          };
         
          

        knex('candidates').select('cpf').where('cpf', cpf)
          .then(usernameList=>{
              if(usernameList.length===0){
                  return knex('candidates')
                  .returning('id')
                  .insert(candidate)
                  .then(()=>{return res.json({message:"user was inserted"})});
              }
              return res.status(404).json({message:"user already exists"})
          })
    
};


// ==================================================================================================
//CONTROLER DE UPDATE DE PERFIL
// ================================================================================================
exports.update = async (req, res) => {


    
  const hash = hashPassword(req.body.password);
  const password = hash.hash;
  const id = crypto.randomBytes(4).toString('HEX');

  const {
      name,
      email,
      number,
      party,
      coalition,
      city,
      state,
      cpf,
      description,
    } = req.body;

    const files = req.files;
    let { profile_pic, cover_pic } = files;
    
// SÓ NÃO ATUALIZA O QRCODE
   
  
    const candidate = {
      id,
      name,
      email,
      password,
      number,
      party,
      coalition,
      city,
      state,
      cpf,
      description,
      profile_pic: profile_pic[0].filename,
      url_profile_pic:`http://192.169.0.110/files/${profile_pic[0].filename}`,
      cover_pic: cover_pic[0].filename,
      url_cover_pic:`http://192.168.0.110/files/${cover_pic[0].filename}`,
      status: 'actived', //actived | deactived | verified
      date: new Date()
    };
   
    

  await knex('candidates').select('email')
        .where('email', email)
        .update(candidate)

    res.status(200).json({message:"User updated"})
};

// =============================================================================================
// DELETE CONTROLLER
// =============================================================================================

exports.remove = (req,res) => {

    const id = req.params.user_id;
    knex('candidates').select('*').where('id',id).delete();

    res.json("User Removed")

}