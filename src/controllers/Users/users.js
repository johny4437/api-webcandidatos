const knex = require('../../database/connection');
const  {hashPassword, comparePassword} = require('../../utils/passwordHash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const{JWT_SECRET} = require('../../variables');
const path = require('path')
require('dotenv').config({path:path.resolve (__dirname ,'..','..', '.env')})

// ESTRUTURA CRUD PRA USUÁRIO





exports.createUser = async(req, res) => {
    
    const {  email, confirm_password, password } = req.body;
    

    if(email !='' && password !=''){
        if(password === confirm_password ){
                 const id = crypto.randomBytes(10).toString('hex');
    // concatena id com milisegundos

                const newId = id + Date.now();
    
                const hash=  hashPassword(password);
                const new_password = hash.hash;


    const user = {
        id:newId,
        email,
        password:new_password,
        
    }

   await knex('users').select('email').where('email',email)
        .then(usernameList =>{
            if(usernameList.length === 0){
                return knex('users')
                .returning('id')
                .insert(user)
                .then(()=> res.status(200).json('usuário criado com sucesso'));
            }else{
                return res.status(400).json('usuário já existe')
            }
            

        })

        }

        else{
            res.status(400).json('As senhas precisam ser iguais')
        }
        
    

    }else{
        res.status(400).json('É preciso inserir todos os dados ')
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
    const { name , email } = req.body;
    const hash = hashPassword(req.body.password);
    const password = hash.hash;

    const profile_pic =  req.file.filename;

    const photo_url = process.env.HOST_URL/profile_pic;

    const user = {
        id,
        name,
        email,
        password,
        profile_pic,
        photo_url
    }

  await  knex('users').select('*')
    .where('id', id)
    .update(user)


    res.json('updated')


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



