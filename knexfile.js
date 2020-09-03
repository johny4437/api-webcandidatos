const path  = require('path');
require('dotenv').config({path:path.resolve (__dirname , './src/.env')})



  module.exports = {

    development:{
      client:process.env.DATABASE_CLIENT,
      connection:{
        database:process.env.DATABASE_NAME,
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT
      },
      migrations:{
        directory:`${__dirname}/src/database/migrations`
      }
    },
  
  
  
  
};
