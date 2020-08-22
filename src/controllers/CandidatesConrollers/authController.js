const knex = require('../../database/connection');
const jwt  = require('jsonwebtoken');
const {comparePassword} = require('../../utils/passwordHash')
const {JWT_SECRET} = require('../../variables');


//CONTROLLER DE LOGIN
exports.singin = async (req, res) =>{
    
    const {email, password} = req.body;

    const user = await knex('candidates').where('email', email)
                        .select('password','id', 'name')
                        .first()

        if(!(comparePassword(password, user.password))){
            res.json("Password doesn't match")
        }
        //generate a token
        const token = jwt.sign({id:user._id}, JWT_SECRET);
        // persist the token
        res.cookie('t',token, {expire:new Date() + 8888});
        const {id, name} = user;
        return res.status(200).json({token, user:{id, name}});
}