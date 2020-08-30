const path  = require('path');
require('dotenv').config({path:path.resolve (__dirname , './src/.env')})



  module.exports = {

    development:{
      client:process.env.DATABASE_CLIENT,
      connection:{
        database:"candidates",
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD
      },
      migrations:{
        directory:`${__dirname}/src/database/migrations`
      }
    },
  
  
  
  
};
