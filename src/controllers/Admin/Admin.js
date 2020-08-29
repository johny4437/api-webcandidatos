const knex = require('../../database/connection');
const crypto = require('crypto')
const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../../variables');
const {hashPassword, comparePassword} = require('../../utils/passwordHash');

exports.createAdmin = async (req, res) => {
    const { username} = req.body;
    const password = hashPassword(req.body.password);
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


}