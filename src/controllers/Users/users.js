const knex = require('../../database/connection');
const  {hashPassword, comparePassword} = require('../../utils/passwordHash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const{JWT_SECRET} = require('../../variables');

// ESTRUTURA CRUD PRA USUÁRIO





exports.create = async(req, res) => {
    
    const { name, email } = req.body;
    const id = crypto.randomBytes(4).toString('hex');

    const hash=  hashPassword(req.body.password);
    const password = hash.hash;
    const profile_pic = req.file.filename;
    const photo_url = `http://127.0.0.1:3333/files/${profile_pic}`;

    const user = {
        id,
        name, 
        email,
        password,
        profile_pic,
        photo_url
    }

   await knex('users').select('email').where('email',email)
        .then(usernameList =>{
            if(usernameList.length === 0){
                return knex('users')
                .returning('id')
                .insert(user)
                .then(()=> res.status(200).json({message:"User created"}));
            }else{
                return res.status(400).json({message:"User already exists"})
            }
            

        })

};
// READ CONTROLLER
exports.read = async (req, res) => {
    const users = await knex('users').select('*')
    res.status(200).json(users)
};

//UPDATE PROFILE

exports.update =  async (req, res) => {
   
    const id = req.params.user_id;
    const { name , email } = req.body;
    const hash = hashPassword(req.body.password);
    const password = hash.hash;

    const profile_pic =  req.file.filename;

    const photo_url = `http://127.0.0.1:3333/files/${profile_pic}`;

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

    const user =  await  knex('users').where('email', email)
                .select('id','name', 'password')
                .first();
    if(!(comparePassword(password, user.password))){
        return res.json({message:"Password doesn't Match"});
    }

    //criando token
    const token = jwt.sign({id:user.id}, JWT_SECRET);
    //persistindo token
    res.cookie('t', token, {expire:new Date() + 8888})

    const { id, name } = user;

    res.status(200).json({token, user:{id, name}})
    



}


