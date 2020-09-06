
const knex = require('../../database/connection');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const path = require('path')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');
const {generateQRCODE, verifyLogin} = require('../../utils/qrGenerator')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})




exports.createCandidate = async (req, res) =>{

        console.log('> create candidate')

       const hash = hashPassword(req.body.password);
      //console.log(req.body.password)
       const password = hash.hash
        console.log(password)
        const cand_id= crypto.randomBytes(10).toString('HEX')
        const id = cand_id + Date.now();

        const {
            name,
            email,
            number,
            party,
            coalition,
            city_id,
            telephone,
            state_id,
            cpf,
            description,
          } = req.body;
    
         
          
          // let { profile_pic, cover_pic, doc_selfie, doc_identity, doc_files_candidate } = files;
          
          
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
          

          const candidate = {
            id,
            name,
            email,
            password,
            number,
            party,
            coalition,
            city_id,
            login:generatedLogin,
            state_id,
            cpf,
            telephone,
            status: 'actived', //actived | deactived | verified
            qrcode:qrcode,
            
          };

        
          

       await knex('candidates').select('cpf','id').where('cpf',cpf)
          .then(usernameList=>{
              if(usernameList.length===0){
                return knex('candidates')
                .insert(candidate)
                .then(()=>{
                  return res.json({message:"USER WAS INSERTED"})
                  
              })
            }else{
              return res.status(404).json({message:"USER ALREADY EXISTS"})

              };
             
          })
    
};
//=================================================================================================
// CONTROLLER DE LER TODOS OS CANDIDATOS
// ================================================================================================

exports.readCandidates = async (req, res) =>{
  
  const candidates = await knex('candidates')
  .select('id','name','party','coalition','description','city_id','state_id','number','url_profile_pic');
  res.json(candidates)
  
};

// =================================================================================================
// BUSCAPARA ATUALIZAÇÂO PERFIL BASICO
// ================================================================================================
/**
 * passa o id do candidato
 */
exports.getSomeCandidateData = async (req, res) =>{
  const candidate_id = req.params.candidate_id;
  
  const candidate = await knex('candidates').where('id',candidate_id).select('id', 
  'name',
  'email',
  'cpf',
  'telephone',
  'city_id',
  'state_id',
  );
   
  const stateId = candidate[0].state_id;
  const cityId = candidate[0].city_id;
  const st = await knex('estados').select('estado').where('id', stateId);
  const ci= await knex('cidades').select('cidade').where('id',cityId);

  var name = candidate[0].name;
  var email = candidate[0].email;
  var cpf = candidate[0].cpf;
  var telephone = candidate[0].telephone;
  var city = ci[0].cidade;
  var state = st[0].estado;

  const user = {
    name,
    email,
    cpf,
    telephone,
    city, 
    state
  }

  res.status(200).json(user)

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
  'id',
  'name',
  'party',
  'coalition',
  'description',
  'city_id',
  'state_id',
  'number',
 ' url_profile_pic',
 'url_cover_pic',
 ' qrcode');
  
  const stateId = candidate[0].state_id;
  console.log(stateId)
  const cityId = candidate[0].city_id;
const st = await knex('estados').select('estado').where('id', stateId);
const ci= await knex('cidades').select('cidade').where('id',cityId);

var name = candidate[0].name;
var party = candidate[0].party;
var coalition = candidate[0].coalition;
var description = candidate[0].description;
var number = candidate[0].number;
var  profile_pic = candidate[0].url_profile_pic;
var  cover_pic =candidate[0].url_cover_pic;
var city = ci[0].cidade;
var state = st[0].estado

const user = {
  name,
  party,
  coalition,
  description,
  number,
  city,
  state,
  profile_pic,
  cover_pic
}
  res.json(user)

}



// ==================================================================================================
//CONTROLER DE UPDATE DE PERFIL
// ================================================================================================
exports.updateCandidate = async (req, res) => {

  const id = req.params.candidate_id;

 


 

  const {
      name,
      email,
      number,
      party,
      coalition,
      profile_pic,
      cover_pic,
      city_id,
      state_id,
      cpf,
      description,
    } = req.body;
    try {


       const candidate = {
      id,
      name,
      email,
      number,
      party,
      coalition,
      city_id,
      state_id,
      cpf,
      description,
      profile_pic: profile_pic,
      url_profile_pic:`http://192.169.0.110/files/${profile_pic}`,
      cover_pic:cover_pic,
      url_cover_pic:`http://192.168.0.110/files/${cover_pic}`,
      status: 'actived', //actived | deactived | verified
      updated_at:new Date()
    };
      await knex('candidates').select('id')
        .where('id', id)
        .update(candidate)

    res.status(200).json({message:"User updated"})


      
    } catch(e) {
      
      res.status(404).json("NOT UPDATED")
    }
// SÓ NÃO ATUALIZA O QRCODE
   }
  // ========================================================================================
   // UPDATE PASSWORD
   // ===================================================================================

   exports.updatePassword = async (req, res) =>{
    
     const candidate_id = req.params.candidate_id;
      const password = hashPassword(req.body.password);
      const hash = password.hash;

      const candidate = {
        password:hash
      }
      try {
        await knex('candidates').select('id')
        .where('id', candidate_id)
        .update(candidate)

    res.status(200).json({message:"PASSWORD UPDATED"})
      } catch (error) {
        res.status(400).json({message:"ERROR TO UPDATE PASSWORD "})
      }


     


   }
    



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
                      .select('password','id', 'name','login')
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
                                     
                                      let id= user.id
                                      
                                      res.status(200).json({token, id})
                                    }
                                  })
                        }
                      })
};


exports.forgotPassword = async (req, res) =>{
  const { email } =  req.body;

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'johnyanastaciods@gmail.com',
    pass: '97909001' // naturally, replace both with your real credentials or an application-specific password
  }
});
  


  await knex('candidates').select('*').where('email', email)
  .then(candidateData =>{
    if(candidateData.length === 0) {
      res.status(400).json({msg: "USER WITH THIS EMAIL DON'T EXIST"})
    }else {

      const token =jwt.sign({id: candidateData.id}, process.env.JWT_SECRET)
       res.cookie('t', token, {expire:new Date() + 8888})
      const mailOptions = {
      from: 'noreply@webcandidatos.com.br',
      to: email,
      subject: 'Recuperaçao de Senha',
      html: `<h4>Clique no link abaixo para trocar a senha:</h4>
        <p>http://127.0.0.1:3333/password/forgot/${token}</p>`

        };
        console.log(candidateData[0].email);
          const cand = {
            resetLink:token
          }

        return knex('candidates').select('*').where('email',candidateData[0].email)
        .update(cand)
        .then(() =>{

          transporter.sendMail(mailOptions, function(error, info){
        if (error) {
              res.status(400).json(error);
        } else {
         res.status(200).json('Email sent Follow the instructions');
        }});

        })
        

      
    }
  })
};

exports.resetPassword = async(req, res) =>{
  const token = req.params.token
  const newPass = hashPassword(req.body.newPass);
  const password = newPass.hash


  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
      if(err){
        res.status(400).json({msg:"Incorretd ToKen or This Token is Expired"})
      }
       return knex('candidates').select('*').where('resetLink', token).then(data =>{
          if(data.length === 0){
              res.status(400).json({error:"This Token is Invalid"})
            }else {

              const cand ={
                password:password
              }

              return knex('candidates').select('*').where('id', data[0].id).update(cand)
              .then(()=>res.status(200).json({msg:"Password was Updated"}))
              .catch((err)=>res.status(400).json({error:"Password was not Updated"}))
      
            }
  })

    })
  }else {
    res.status(400).json({error:"Authentication Failed"})
  }

 
}


exports.singout = (req, res) =>{
  res.clearCookie("t");
  return res.json({message:"Singout Sucess"});
}
