
const knex = require('../../database/connection');
const crypto = require('crypto')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');
const {generateQRCODE} = require('../../utils/qrGenerator')


require('dotenv').config({path:'../../.env'})


exports.create = async (req, res) =>{


    
        const hash = hashPassword(req.body.password);
        const password = hash.hash;
        const id = crypto.randomBytes(10).toString('HEX');
      
       

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
          let { profile_pic, cover_pic, doc_selfie, doc_identity, doc_files_candidate } = files;
          const text = `http://192.168.0.110:3333/candidates/${id}`
          
          let qrcode = await generateQRCODE('http://127.0.0.1:3333'+ number);

        

         
        
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
            doc_selfie:doc_selfie[0].filename,
            url_doc_selfie:`http://192.168.0.110/files/${doc_selfie[0].filename}`,
            doc_identity:doc_identity[0].filename,
            url_doc_identity:`http://192.168.0.110/files/${doc_identity[0].filename}`,
            doc_files_candidate:doc_files_candidate[0].filename,
            url_doc_files_candidate:`http://192.168.0.110/files/${doc_files_candidate[0].filename}`,
            status: 'actived', //actived | deactived | verified
            qrcode:qrcode,
            
          };
         
          

       await knex('candidates').select('cpf','id').where('cpf',cpf)
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
//=================================================================================================
// CONTROLLER DE LER TODOS OS CANDIDATOS
// ================================================================================================

exports.read = async (req, res) =>{
  
  const candidates = await knex('candidates')
  .select('id','name','party','coalition','description','city','state','number','url_profile_pic');
  res.json({candidates})
  
}
// =================================================================================================
// BUSCA POR UM CANDIDATO ESPECIFICO
// ================================================================================================
/**
 * passa o id do candidato
 */
exports.getCandidate = async(req, res) =>{
  
  const id = req.params.candidate_id;
  
  const candidate = await knex('candidates').where('id',id).select('*');
  res.json({candidate})
}

// ==================================================================================================
// BUSCA POR CIDADE OU ESTADO
// ===================================================================================================

/**
 * cidade/
 * by city = /candidates?city=saomateus
 * 
 */
exports.list = async (req, res) => {
  let {city, state} = req.query; 


  if(city){
    const user = await knex('candidates').select('id','name','party','coalition','description','city','state','number','url_profile_pic')
    .limit(6)
    .where('city','like',`%${city}%`)
    .orWhere('state','like',`%${state}%`)
    res.json({user})
  }else{
    res.json({message:"NOT FOUND"})

  }

  
            

     
}


// ==================================================================================================
//CONTROLER DE UPDATE DE PERFIL
// ================================================================================================
exports.update = async (req, res) => {

  const id = req.params.candidate_id;

    
  const hash = hashPassword(req.body.password);
  const password = hash.hash;
 

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
    };
   
    

  await knex('candidates').select('id')
        .where('id', id)
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

//CONTROLLER DE LOGIN PARA CANDIDATO
exports.singin = async (req, res) =>{
    
  const {email, password} = req.body;


  

    knex('candidates').where('email', email)
                      .select('password','id', 'name')
                      .first()
                      .then(user =>{
                        if(!user){
                          res.status(401).json({
                            error: "USER NOt EXISTS"
                         })
                        }else{
                          return comparePassword(password, user.password)
                                  .then(isAuthenticated=>{
                                    if(!isAuthenticated){
                                      res.status(401).json({
                                        error: "Unauthorized Access!"
                                      })
                                    }else{
                                      const token = jwt.sign({id:user.id}, JWT_SECRET)
                                      //persistindo token
                                      res.cookie('t', token, {expire:new Date() + 8888})
                                      res.status(200).json({token, user})
                                    }
                                  })
                        }
                      })
                      
      // if(!(comparePassword(password, user.password))){
      //     res.json("Password doesn't match")
      // }
      
}

