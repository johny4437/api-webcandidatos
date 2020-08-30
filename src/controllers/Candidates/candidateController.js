
const knex = require('../../database/connection');
const crypto = require('crypto')
const path = require('path')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');
const {generateQRCODE, verifyLogin} = require('../../utils/qrGenerator')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})


exports.createCandidate = async (req, res) =>{

        console.log('> create candidate')
    
        const hash = hashPassword(req.body.password);
        const password = hash.hash;
        const cand_id= crypto.randomBytes(10).toString('HEX')
        const id = cand_id + Date.now();

        const {
            name,
            email,
            number,
            party,
            coalition,
            city,
            telephone,
            state,
            cpf,
            description,
          } = req.body;
    
          const files = req.files;
          let { profile_pic, cover_pic, doc_selfie, doc_identity, doc_files_candidate } = files;
          
          
          let newName = name.replace(/[^A-Z0-9]+/ig, "-").toLowerCase(); 
          // busca new name no banco
          let candidateAux = await knex('candidates').where('login', newName).select('login')
          
          console.log(candidateAux)

          let indiceLogin = 0

          // caso exista
          if(candidateAux.length !== 0){
            console.log(`>> login ${newName} ja existe.`)
            
            do{
              indiceLogin++

              // busca no banco new name + - i
              console.log('>>> testando nome '+newName+'-'+indiceLogin)
              candidateAux = await knex('candidates').where('login', newName+'-'+indiceLogin).select('login')

            }while(candidateAux.length !== 0) //enquanto a consulta retorna true
            //ou seja, enquanto existe candidato com o login gerado, gera um novo login incrementando o contador
          }

          const generatedLogin = (indiceLogin > 0) ? newName+'-'+indiceLogin : newName
          
          let qrcode = await generateQRCODE('https://www.webcandidatos.com.br/user/'+ newName); 
         
       
;         
        
          const candidate = {
            id,
            name,
            email,
            password,
            number,
            party,
            coalition,
            city,
            login:generatedLogin,
            state,
            cpf,
            telephone,
            description,
            profile_pic: profile_pic[0].filename,
            url_profile_pic:process.env.HOST_URL+"/"+profile_pic[0].filename,
            cover_pic: cover_pic[0].filename,
            url_cover_pic: process.env.HOST_URL+"/"+cover_pic[0].filename,
            doc_selfie: doc_selfie[0].filename,
            url_doc_selfie: process.env.HOST_URL+"/"+doc_selfie[0].filename,
            doc_identity: doc_identity[0].filename,
            url_doc_identity: process.env.HOST_URL+"/"+doc_identity[0].filename,
            doc_files_candidate: doc_files_candidate[0].filename,
            url_doc_files_candidate:process.env.HOST_URL+"/"+doc_files_candidate[0].filename,
            status: 'actived', //actived | deactived | verified
            qrcode:qrcode,
            
          };

        
          

       await knex('candidates').select('cpf','id').where('cpf',cpf)
          .then(usernameList=>{
              if(usernameList.length===0){
                return knex('candidates')
                .insert(candidate)
                .then(()=>{
                  return res.json({message:"user was inserted"})
              });
            }else{
              return res.status(404).json({message:"user already exists"})
              }
             
          })
    
};
//=================================================================================================
// CONTROLLER DE LER TODOS OS CANDIDATOS
// ================================================================================================

exports.readCandidates = async (req, res) =>{
  
  const candidates = await knex('candidates')
  .select('id','name','party','coalition','description','city','state','number','url_profile_pic');
  res.json(candidates)
  
}
// =================================================================================================
// BUSCA POR UM CANDIDATO ESPECIFICO
// ================================================================================================
/**
 * passa o id do candidato
 */
exports.getOneCandidate = async(req, res) =>{
  
  const login = req.params.login;
  
  const candidate = await knex('candidates').where('login',login).select('id', 
  'name',
  'party',
  'coalition',
  'description',
  'city',
  'state',
  'number',
 ' url_profile_pic',
 'url_cover_pic',
 ' qrcode');
  
  


res.json(candidate[0]);
}




// ==================================================================================================
//CONTROLER DE UPDATE DE PERFIL
// ================================================================================================
exports.updateCandidate = async (req, res) => {

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
      updated_at:new Date()
    };
   
    

  await knex('candidates').select('id')
        .where('id', id)
        .update(candidate)

    res.status(200).json({message:"User updated"})
};

// =============================================================================================
// DELETE CONTROLLER
// =============================================================================================

exports.removeCandidate = (req,res) => {

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
                                        error: "WRONG PASSWORD"
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
}
