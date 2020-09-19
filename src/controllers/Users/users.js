const knex = require('../../database/connection');
const  {hashPassword, comparePassword} = require('../../utils/passwordHash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const{JWT_SECRET} = require('../../variables');
const path = require('path')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})

// ESTRUTURA CRUD PRA USUÁRIO

exports.createUser = async(req, res) => {
    
  const {  email, confirm_password, password,state_id, city_id } = req.body;
    
    if(email !='' && password !=''){
      if(password === confirm_password ){
        //verifica se o email não está cadastrado na tabela de candidatos
        await knex('candidates')
          .select('email')
          .where('email', email)
          .then(async candidateData => {
            if(candidateData.length === 0){
              //caso não tenha cadastrado na tabela de candidatos, prossegue com o algoritmo

              await knex('users')
                .select('email')
                .where('email',email)
                .then(usernameList =>{
                  if(usernameList.length === 0){
                    const id = crypto.randomBytes(10).toString('hex');
                    // concatena id com milisegundos
                    const newId = id + Date.now();
                    const hash=  hashPassword(password);
                    const new_password = hash.hash;


                    const user = {
                      id:newId,
                      email,
                      password:new_password,
                      state_id,
                      city_id
                    }

                    return knex('users')
                      .returning('id')
                      .insert(user)
                      .then(()=> res.status(200).json('usuário criado com sucesso'));
                  }else{
                    console.log('email ja cadastrado em users')
                    return res.status(400).json({message: 'O usuário já existe, recupere a senha ou use outro e-mail'})
                  }
                })
            }else{
              console.log('email ja cadastrado em candidates')
              return res.status(400).json({message: 'O usuário já existe, recupere a senha ou use outro e-mail'})
            }
          })
      }else{
        res.status(400).json({message: 'As senhas precisam ser iguais'})
      }
    }else{
      res.status(400).json({message: 'É preciso inserir todos os dados '})
    }
};
// READ CONTROLLER
exports.readUser = async (req, res) => {
    const users = await knex('users').select('*')
    res.status(200).json(users)
};

//UPDATE PROFILE

exports.updateUser =  async (req, res) => {
   
    const id = req.params.user_id;
    const { name  } = req.body;
   
   
    const profile_pic =  req.file.filename;

    const photo_url = process.env.HOST_URL/profile_pic;

    const user = {
        id,
        name,
        profile_pic,
        photo_url
    }
    console.log(photo_url)

  await  knex('users').select('*')
    .where('id', id)
    .update(user)
    .then(()=>{
        res.json('Usuário atualizado')
    })
    .catch(()=>{
        res.json('Usuário não atualizado')
    })


    


};


// LOGIN CONTROLLER
exports.singin= async (req, res) => {
    
    const { email, password } = req.body;

    
    knex('users').where('email', email)
    .select('password','id', 'name')
    .first()
    .then(user =>{
      if(!user){
        res.status(401).json({
          error: "USER NOT EXISTS"
       })
      }else{
        return comparePassword(password, user.password)
                .then(isAuthenticated=>{
                  if(!isAuthenticated){
                    res.status(401).json({
                      error: "PASSWORD  MUST BE WRONG"
                    })
                  }else{
                    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET)
                    //persistindo token
                    res.cookie('t', token, {expire:new Date() + 8888})
                    res.status(200).json({token, user})
                  }
                })
      }
    })
    
    



};
exports.singout = (req, res) =>{
  res.clearCookie("t");
  return res.json({message:"Singout Sucess"});
}



