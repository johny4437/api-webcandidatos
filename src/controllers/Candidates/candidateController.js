
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
        city_id,
        login:generatedLogin,
        state_id,
        cpf,
        telephone, //actived | deactived | verified
        qrcode:qrcode,

      };
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
      subject: 'Confirmação de Cadastro',
      text:`${name} sua conta foi criada com sucesso`
      +'Para prosseguir com a mudança de senha por favor clique no link abaixo.\n\n '
      +`http://127.0.0.1:3000/login.\n\n`
      +'Caso você não tenha solicitado a mudança de senha desconsidere este email.\n'

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

                   const role = {
                        roles:"1",
                        user_id:newId
                    }
                    return knex('roles').insert(role).then(()=>{
                           transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                       res.status(400).json(error);
                                  } else {
                                  let msg = 'Email sent. Follow the instructions';
                                  var data = {
                                    msg
                                  }
                                   res.status(200).json(data);

                             }}) 



                    })

                    // .catch(()=>{
                    //     res.status(400).json('Usuario nao criado')
                    // })

               
                  
              }).catch(() =>{
                  res.status(400).json({msg:'User Not Inserted'})
                });  
            }else{
              return res.status(404).json({message:"Este usuário já está cadastrado"})

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
    'proposals'
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
      state: stateId,
      city: cityId,
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
      profile_pic,
      cover_pic,
      cpf,
      description,
      hastags,
      badges,
      proposals
    } = req.body;

    // console.log(cover_pic)
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
      console.log(cover_pic)

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

       const {old_password, password_1, password_2} = req.body 



       if(old_password!=""){
           const verify_old_pass = await knex('candidates').select("password").where('id', candidate_id);
           
           comparePassword(old_password, verify_old_pass[0].password).then(data =>{
             if(!data){
               res.json('Senha antiga está incorreta')
             }else{

               if(password_1!=""){
                 const password = hashPassword(password_1)
                     const hash = password.hash
                     const candidate = {
                       password:hash
                     }
                     if(password_1 === password_2){

                       return knex('candidates').select('id').where('id', candidate_id).update(candidate)
                     .then(()=>{
                       res.status(200).json("Senha Atualizada")
                     }).catch(()=>{
                       res.status(404).json("Erro ao atualizar senha")
                     })


                     }else{
                       res.json('As senhas precisam ser iguais')
                     }
                   
                 }else{
                     res.json('insira uma  nova senha por favor')
                 }

             }
           })
           

       }else{
         res.json('É necessário passar senha antiga')
       }

       // .status(404)
    }
    

// ======================================================================================
// UPDATE PROFILE PIC
// =======================================================================================
exports.updateProfilePic = async (req, res) =>{
  const profile_pic = req.body.profile_pic;
  console.log(req.body)
  const id = req.params.candidate_id;
  const cand = {
    profile_pic
  }
  

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

//CONTROLLER DE LOGIN PARA CANDIDATO e USUARIO NO APP
exports.singin = async (req, res) =>{
    
  const {email, password} = req.body;
 

if(email != ''){
  if(password != ''){
     await knex('candidates').where('email', email)
                      .select('password','id', 'name','login', 'status','role')
                      .first()
                      .then(user =>{
                        
                        if(!user){
                         return  knex('users').where('email', email)
                          .select('password','id', 'name','role')
                          .first()
                          .then(user_2 =>{
                           
                            if(!user_2){
                              res.json("Este usuário não está cadastrado")
                            }else{
                              
                              return comparePassword(password, user_2.password)
                                  .then(isAuthenticated=>{
                                    if(!isAuthenticated){
                                      res.json(
                                       "Senha incorreta"
                                      )
                                    }else{
                                      const token = jwt.sign({id:user_2.id}, JWT_SECRET)
                                      //persistindo token
                                      res.cookie('t', token, {expire:new Date() + 8888})
                                     
                                      let id= user_2.id
                                      let role = user_2.role
                                      
                                      
                                      res.status(200).json({token, id, role})
                                    }
                                  })
                           

                            }

                          })
                          
                          
                        }

                        else{

                           if(user.status == 'deactived'){
                             res.json('Usuário desativado')
                           }else{
                              return comparePassword(password, user.password)
                                  .then(isAuthenticated=>{
                                    if(!isAuthenticated){
                                      res.json(
                                       "Senha incorreta"
                                      )
                                    }else{
                                      const token = jwt.sign({id:user.id}, JWT_SECRET)
                                      //persistindo token
                                      res.cookie('t', token, {expire:new Date() + 8888})
                                     
                                      let id= user.id
                                      let username= user.login
                                      let role = user.role
                                      
                                      res.status(200).json({token, id, username, role})
                                    }
                                  })
                           }
                        }
                      })




  }else{
    res.json('Senha não fornecida')
  }
  
}else{
  res.json('Email não fornecido')
}

  

    
};


// CONTROLLER DE LOGIN PARA CANDIDATO NO SITE
exports.loginSite = async (req, res) =>{
    
  const {email, password} = req.body;
 

if(email != ''){
  if(password != ''){
     await knex('candidates').where('email', email)
                      .select('password','id', 'name','login', 'status','role')
                      .first()
                      .then(user =>{
                        
                        if(!user){
                         return  knex('users').where('email', email)
                          .select('password','id', 'name','role')
                          .first()
                          .then(user_2 =>{
                           
                            if(!user_2){
                              res.json("Este usuário não está cadastrado")
                            }else{
                                res.json("Este usuário não é um candidato")
                            }

                          })
                          
                          
                        }

                        else{

                         
                           
                              return comparePassword(password, user.password)
                                  .then(isAuthenticated=>{
                                    if(!isAuthenticated){
                                      res.json(
                                       "Senha incorreta"
                                      )
                                    }else{
                                      const token = jwt.sign({id:user.id}, JWT_SECRET)
                                      //persistindo token
                                      res.cookie('t', token, {expire:new Date() + 8888})
                                     
                                      let id= user.id
                                      let status = user.status
                                      let username= user.login
                                      let role = user.role
                                      
                                      res.status(200).json({token, id, username, role, status})
                                    }
                                  })
                           
                        }
                      })




  }else{
    res.json('Senha não fornecida')
  }
  
}else{
  res.json('Email não fornecido')
}

  

    
};




exports.forgotPassword = async (req, res) =>{
  const { email } =  req.body;
  console.log(req.body)

  if(email != ''){
     const transporter = nodemailer.createTransport({
          pool: true,
          host: "mail.webcandidatos.com.br",
          port: 465,
          secure: true, // use TLS
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
            }
         });

  
const candidate_data =  await knex('candidates').select('*').where('email', email);

 
 
    if(candidate_data.length === 0) {

        const user_data =  await knex('users').select('*').where('email', email)
         if(user_data.length === 0){
           res.json( "Usuário com esse email não existe")
         }
         else {

      const token =jwt.sign({id: user_data.id, exp: Math.floor(Date.now() / 1000) + (60 * 60)} ,process.env.JWT_SECRET)
      console.log(token)
       
      const mailOptions = {
      from: 'noreply@webcandidatos.com.br',
      to: email,
      subject: 'Resetar Senha',
      text:'Sua solicitação para resetar senha Foi efetuada com sucesso.\n\n'
      +'Para prosseguir com a mudança de senha por favor clique no link abaixo.\n\n '
      +`http://www.webcandidatos.com.br:3000/password/reset/${token}.\n\n`
      +'Caso você não tenha solicitado a mudança de senha desconsidere este email.\n'

        };
        //console.log(candidateData[0].email);
          const cand = {
            resetLink:token
          }

        return knex('users').select('*').where('email',user_data[0].email)
        .update(cand)
        .then(() =>{

          transporter.sendMail(mailOptions, function(error, info){
        if (error) {
              res.status(400).json(error);
        } else {
          let msg = 'Email enviado siga as instruções para alterar a sua senha';
          var data = {
            msg,
            token
          }
         res.status(200).json(data);

        }});

        })
        

      
    }

      
    }else {

      const token =jwt.sign({id: candidate_data.id, exp: Math.floor(Date.now() / 1000) + (60 * 60)} ,process.env.JWT_SECRET)
      
       
      const mailOptions = {
      from: 'noreply@webcandidatos.com.br',
      to: email,
      subject: 'Resetar Senha',
      text:'Sua solicitação para resetar senha Foi efetuada com sucesso.\n\n'
      +'Para prosseguir com a mudança de senha por favor clique no link abaixo.\n\n '
      +`http://127.0.0.1:3000/password/reset/${token}.\n\n`
      +'Caso você não tenha solicitado a mudança de senha desconsidere este email.\n'

        };
        //console.log(candidateData[0].email);
          const cand = {
            resetLink:token
          }

        return knex('candidates').select('*').where('email',candidate_data[0].email)
        .update(cand)
        .then(() =>{

          transporter.sendMail(mailOptions, function(error, info){
        if (error) {
              res.status(400).json(error);
        } else {
          let msg = 'Email enviado siga as instruções para alterar a sua senha';
          var data = {
            msg,
            token
          }
         res.status(200).json(data);

        }});

        })
        

      
    }
  



  }else{
    res.status(404).json('É preciso inserir o email cadastrado')
  }
 
     
};

exports.resetPassword = async(req, res) =>{
  const token = req.params.token
  
 // console.log(token)

  if(token){
    jwt.verify(token, process.env.JWT_SECRET, async (err,decoded)=>{
      if(err){
        res.json("Token incorreto ou expirado")
      }
       const data = await knex('candidates').select('*').where('resetLink', token);
         // console.log(data)
          if(data.length === 0){

            const user_data =  await knex('users').select('*').where('resetLink', token);

              if(user_data.length === 0){
                 res.json("Token inválido ou expirou")
              }else{
                res.json({msg:'Token válido', email:user_data[0].email})
              }
             
              // console.log('This Token is Invalid')
            }else {
             res.json({msg:"Token válido", email:data[0].email})
              }
})
}else {
    res.json("Falha na autenticação")
    // console.log('Falha na autenticação')
  }

 
};


exports.setNewForgotPass = async(req, res) =>{
  const {email,password, confirm_pass} = req.body

  
    if(password === confirm_pass){
            const newPass = hashPassword(password);
            const hash = newPass.hash
            const cand ={
                password:hash
              }

               const candidate =    await knex('candidates').select('*').where('email', email);
                  
               if(candidate.length === 0){
                 
                 const user =  await knex('users').select('*').where('email', email);
                 if(user.length !== 0){
                      return await knex('users').select('*').where('email', email).update(cand)
                       .then(()=>{
                           res.status(200).json('Senha atualizada')
                        }).catch(()=>{
                             res.status(400).json('Problema ao atualizar senha')
                         })

                 }

                 I
               }else{

                 return await knex('candidates').select('*').where('email', email).update(cand)
                 .then(()=>{
                   res.status(200).json('Senha atualizada')
                 }).catch(()=>{
                     res.status(400).json('Problema ao atualizar senha')
                 })
               }
    }else{
     console.log('As senhas precisam ser iguais')
    }

  

  

}

exports.singout= async (req, res) =>{
  res.clearCookie("t");
  return res.json("Singout Sucess");
}












