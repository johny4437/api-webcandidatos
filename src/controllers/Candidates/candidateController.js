
const knex = require('../../database/connection');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const path = require('path')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');
const {generateQRCODE, verifyLogin} = require('../../utils/qrGenerator')
const fs = require('fs');
const {imageDecode} = require('../../utils/decodeFunctionImage')

require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})




exports.createCandidate = async (req, res) =>{

  let { password } = req.body

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
    passwordAgain
  } = req.body

  //verificar se os campos tem dados válidos, senão enviar um erro
  if(name != '' && email != '' && cpf != '' && telephone != '' && state_id > 0 && city_id > 0 && password != '' && passwordAgain != ''){
    

    //comparar se as senhas são iguais, senão enviar um erro
    if(password === passwordAgain){
      const hash = hashPassword(req.body.password);
      //console.log(req.body.password)
      password = hash.hash
      //console.log(password)
      const cand_id= crypto.randomBytes(10).toString('HEX')
      const id = cand_id + Date.now();

      let newName = name.replace(/[^A-Z0-9]+/ig, "-").toLowerCase(); 
      // busca new name no banco
      let candidateAux = await knex('candidates').where('login', newName).select('login')
      
      //console.log(candidateAux)

      let indiceLogin = 0
          // DADOS PARA ENVIAR EMAIL

       // DADOS PARA ENVIAR EMAIL
      const transporter = nodemailer.createTransport({
        pool: true,
        host: "mail.webcandidatos.com.br",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "noreply@webcandidatos.com.br",
            pass: "ImaG9tC8pWJ5"
        }
      });

      const mailOptions = {
        from: 'noreply@webcandidatos.com.br',
        to: email,
        subject: 'Conta criada com sucesso',
        text:`${name} seu cadastro foi feito com sucesso.\n\n`
        +'Por favor clique no link abaixo para entrar em sua conta.\n\n'
        +`https://www.webcandidatos.com.br/login`
      };

      // caso exista
      if(candidateAux.length !== 0){
        //console.log(`>> login ${newName} ja existe.`)
        
        do{
          indiceLogin++

          // busca no banco new name + - i
          //console.log('>>> testando nome '+newName+'-'+indiceLogin)
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
      
      try{
        await knex('candidates')
          .select('cpf','id')
          .where('cpf', cpf)
          .orWhere('email', email)
          .then(usernameList=> {
            if(usernameList.length === 0){
              knex('candidates') 
                .insert(candidate)
                .then(()=>{

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      //res.status(400).json(error);
                      console.log('>> erro ao enviar email '+error)
                    }else{
                      let msg = 'Email sent. Follow the instructions';
                      var data = {
                        msg
                      }
                      //res.status(200).json(data);
                      console.log('>> email enviado com sucesso!')
                    }
                  }); 

                  return res.json({message:"USUÁRIO CADASTRADO COM SUCESSO"})
                })
            }else{
              //console.log('usuário ja existe')
              console.log('> error')
              return res.status(400).send({ message: "USUÁRIO JÁ CADASTRADO" })
            };
          })
      }catch(e){
        console.log(error)
        return res.status(400).send({ error })
      }
      

    }else{ //as senhas não são iguais, erro
      console.log('> as senhas não conferem')
      return res.status(400).json({message: "AS SENHAS NÃO CONFEREM"})
    } 

  }else{ //tem algum dado faltando, erro
    console.log('> erro dados inválidos')
    return res.status(400).json({ message: "DADOS INVÁLIDOS" })  
  } 
    
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
  
  try{
    const candidate = await knex('candidates').where('id',candidate_id).select(
      'id', 
    'name',
    'email',
    'cpf',
    'telephone',
    'city_id',
    'state_id',
    'login',
    'qrcode',
    'number',
    'party',
    'coalition',
    'description',
    'profile_pic',
    'badges',
    'proposals',
    'cover_pic'
    );
    
    const stateId = candidate[0].state_id;
    const cityId = candidate[0].city_id;
    
    const hs = await knex('hastags').select('hastag').where('candidate_id', candidate_id)

    let hastags = []
    hs.map(hashtag => {
      hastags.push(hashtag.hastag)
    });
    
    if(hs.length > 0) hastags[0] = '#'+hastags[0]

    const user = {
      ...candidate[0],
      state_id: stateId,
      city_id: cityId,
      hastags: hastags.join(' #'),
    }
    
    res.status(200).json(user)
  }catch(e){
    res.status(400).json({error:"USER NOT FOUND"})
  }

  

}

// =================================================================================================
// BUSCA POR UM CANDIDATO ESPECIFICO
// ================================================================================================
/**
 * passa o id do candidato
 */
exports.getOneCandidate = async(req, res) =>{
  
  const login = req.params.login;
  try {
     const candidate = await knex('candidates').where('login',login).select('id', 
      'id',
      'name',
      'party',
      'coalition',
      'description',
      'city_id',
      'state_id',
      'number',
      'profile_pic',
      'cover_pic',
      'badges',
      'proposals');
  
  const stateId = candidate[0].state_id;
  //console.log(stateId)
  const cityId = candidate[0].city_id;
  const st = await knex('estados').select('estado').where('id', stateId);
  const ci= await knex('cidades').select('cidade').where('id',cityId);

  // let name = candidate[0].name;
  // let party = candidate[0].party;
  // let coalition = candidate[0].coalition;
  // let description = candidate[0].description;
  // let number = candidate[0].number;
  // let  profile_pic = candidate[0].profile_pic;
  // let  cover_pic =candidate[0].cover_pic;
  // let city = ci[0].cidade
  // let state = st[0].estado

  const user = {
    ...candidate[0],
    city: ci[0].cidade,
    state: st[0].estado,
  }

  //console.log(user)

  res.json(user)

  } catch(e) {
    res.status(400).json({error:"USER NOT FOUND"})
  }
 

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
      city_id,
      state_id,
      cpf,
      description,
      hastags,
      badges,
      proposals
    } = req.body;
    try {      
      
      let hashtagsArr = hastags.split('#')
      //console.log(hashtagsArr)
      hashtagsArr = hashtagsArr.map(s => s.trim()) //tira os espaços em branco
      //console.log(hashtagsArr)

      //console.log('> update candidate')
      //console.log(hashtagsArr)
      //excluir hashtags que o candidato escolheu não usar mais, ou seja,
      //as hashtags que não estão no vetor hashtagsArr porém estão no banco
      const hs = await knex('hastags').select('*')
                        .where('candidate_id', id)
      //console.log('> hs '+hs.length)
      hs.map(async hsOld => {
        //console.log('hsold: '+hsOld)
        ///caso não esteja no array, exclui
        if(!hashtagsArr.includes(hsOld.hastag)){
          //console.log('>> remove '+hsOld.id)
          //console.log('>> hashtag '+hsOld.hastag)
          await knex('hastags').where({'id': hsOld.id}).del();
        }
      })

      
      //para cada uma das hashtags, salva na tabela
      hashtagsArr.map(hastag => {
        //console.log('> salva '+hastag)
        if(hastag !== '' && hastag !== ' '){
          const hastagData = {
            hastag: hastag.trim(),
            candidate_id: id
          }
      
          knex('hastags').select('*')
            .where('hastag', hastag)
            .where('candidate_id', id)
            .then(data => {
                if(data.length === 0){
                    knex('hastags').insert(hastagData)
                      .then(() =>{
                          //res.status(200).json({msg:"HASTAG CREATED"})
                      })
                }else{
                    //res.status(404).json({msg:"HASTAG ALREADY EXISTS"})
                }
            })
        }
        
      })

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
        status: 'actived', //actived | deactived | verified
        updated_at:new Date(),
        badges,
        proposals
    };

    await knex('candidates').select('id')
        .where('id', id)
        .update(candidate)

    res.status(200).json({message:"User updated"})


      
    } catch(e) {
      
      res.status(404).json("NOT UPDATED "+e)
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
    

// ======================================================================================
// UPDATE PROFILE PIC
// =======================================================================================
exports.updateProfilePic = async (req, res) =>{
  
  //console.log('req.body = ')
  //console.log(req.body)
  const profile_pic = req.body.profile_pic;
  const id = req.params.candidate_id;
  const cand = {
    profile_pic
  }

  //console.log(profile_pic)

  await knex('candidates').select('*').where('id',id).then(data=>{
    if(data.length !==0){
      // console.log(data[0].id)
      return knex('candidates').where('id', data[0].id).update(cand).then(()=>{
        res.status(200).json({msg:"PROFILE PIC UPDATED"})
      }).catch(()=>{
        res.status(400).json({msg:"ERROR TO UPDATE PROFILE PIC"})
      })
    }else{
      res.status(400).json({msg:"USER NOT FOUND"})
    }
  })

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
    pool: true,
    host: "mail.webcandidatos.com.br",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "noreply@webcandidatos.com.br",
        pass: "ImaG9tC8pWJ5"
    }
  });
  


  await knex('candidates').select('*').where('email', email)
  .then(candidateData =>{
    if(candidateData.length === 0) {
      res.status(400).json({msg: "USER WITH THIS EMAIL DON'T EXIST"})
    }else {

      const token =jwt.sign({id: candidateData.id, exp: Math.floor(Date.now() / 1000) + (60 * 60)} ,process.env.JWT_SECRET)
      
       
      const mailOptions = {
      from: 'noreply@webcandidatos.com.br',
      to: email,
      subject: 'Resetar Senha',
      text:'Sua solicitação para resetar senha foi efetuada com sucesso.\n\n'
      +'Para prosseguir com a mudança de senha por favor clique no link abaixo.\n\n '
      +`https://www.webcandidatos.com.br/password/reset/${token}.\n\n`
      +'Caso você não tenha solicitado a mudança de senha desconsidere este email.\n'

        };
        //console.log(candidateData[0].email);
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
          let msg = 'Email sent. Follow the instructions';
          var data = {
            msg,
            token
          }
         res.status(200).json(data);

        }});

        })
        

      
    }
  })
};

exports.resetPassword = async(req, res) =>{
  const token = req.params.token
  
 // console.log(token)

  if(token){
    jwt.verify(token, process.env.JWT_SECRET, async (err,decoded)=>{
      if(err){
        res.json({msg:"Incorretd ToKen or This Token  Expired"})
      }
       return await knex('candidates').select('*').where('resetLink', token).then(data =>{
         // console.log(data)
          if(data.length === 0){

              res.json({msg:"This Token is Invalid or Expirate"})
              // console.log('This Token is Invalid')
            }else {
             

              //
               res.json({msg:"This Token is Ok", email:data[0].email})
              // console.log('Token is Ok')
            }
  }).catch(err =>{
    res.json(err)
  })

    })
  }else {
    res.json({msg:"Authentication Failed"})
    // console.log('Falha na autenticação')
  }

 
};


exports.setNewForgotPass = async(req, res) =>{
  const {email,password} = req.body
  const newPass = hashPassword(password);
  const hash = newPass.hash
const cand ={
  password:hash
}

              await knex('candidates').select('*').where('email', email).update(cand)
              .then(()=>res.json({msg:"Password was Updated"}))
              .catch((err)=>res.json({msg:"Password was not Updated"}))

}

exports.singout=() =>{
  res.clearCookie("t");
  return res.json({message:"Singout Sucess"});
}


exports.removeProfilePic = async (req, res) => {

  const id = req.params.candidate_id;
  
  const candidate = await knex('candidates').where('id',id).select('profile_pic');

  //console.log(candidate[0].profile_pic)
  try {
    const pathFile = candidate[0].profile_pic.split("/")
    
    fs.unlink(path.resolve(__dirname, '..' ,'..', '..', 'tmp', 'uploads')+'/'+pathFile[4], (err) => {
      if (err) {
        console.error(err)
        return
      }
    
      //file removed
    })
    //file removed

    //atualiza a foto do usuário para null
    const updatedCandidate = {
      id,
      profile_pic: null,
      updated_at: new Date(),
    }
    
    await knex('candidates').select('id')
      .where('id', id)
      .update(updatedCandidate)
    res.status(200).json({message:"Foto removida com sucesso!"})
  } catch(error) {
    res.status(400).json("> Erro ao remover foto "+error) 
  }
}

exports.removeCoverPic = async (req, res) => {

  const id = req.params.candidate_id;
  
  const candidate = await knex('candidates').where('id',id).select('cover_pic');

  //console.log(candidate[0].cover_pic)
  try {
    const pathFile = candidate[0].cover_pic.split("/")
    
    fs.unlink(path.resolve(__dirname, '..' ,'..', '..', 'tmp', 'uploads')+'/'+pathFile[4], (err) => {
      if (err) {
        console.error(err)
        return
      }
    
      //file removed
    })
    //file removed

    //atualiza a foto do usuário para null
    const updatedCandidate = {
      id,
      cover_pic: null,
      updated_at: new Date(),
    }
    
    await knex('candidates').select('id')
      .where('id', id)
      .update(updatedCandidate)
    res.status(200).json({message:"Foto removida com sucesso!"})
  } catch(error) {
    res.status(400).json("> Erro ao remover foto "+error) 
  }
}











