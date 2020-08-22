const jwt = require('jsonwebtoken');
const {JWT_SECRET} =  require('../variables')


const auth = (req, res, next) =>{

        const authHeader = req.headers.authorization;

        if(!authHeader){
            res.json("No token provided")
        }
        const parts = authHeader.split(' ');

        if(!parts.length == 2){
            res.staus(401).json("Token Error");
        }
        
        const [scheme, token] = parts;
        if(!/^Bearer$/i.test(scheme)){
            res.json({error:"Token in bad format"});
        } 
        jwt.verify(token, JWT_SECRET, (err, decoded)=>{
            if(err){
                res.json({message:"Token doesn't match"});
            }
            else{
                req.user = decoded.id
                next();
            }
        })
}
module.exports = auth;