const knex = require('../../database/connection');
const crypto = require('crypto')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');

exports.createAdmin = async (req, res) => {
    const { username} = req.body;
    const hash = hashPassword(req.body.password);
    const password = hash.hash;
    const id = Date.now() + crypto.randomBytes(8).toString('hex');

    const admin = {
        id,
        username,
        password
    };

    await knex('admin').where('username', username).select('*')
    .then(data => {
        if(data.length === 0){
            return knex('admin').insert(admin)
            .then(() => {
                res.status(200).json({msg:"CREATED"})
            }).catch(() => {
                res.status(400).json({error:"ERROR TO INSERT"})
            })
        }else{
            res.status(400).json({msg:"USER ALREADY EXISTS"})
        }
    })


};

exports.singinAdmin =async (req, res) => {
    const {username, password} = req.body;
    
    await knex('admin').where('username', username)
    .select('password','id')
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

}