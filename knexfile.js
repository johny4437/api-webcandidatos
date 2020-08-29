const path  = require('path');
require('dotenv').config({path:path.resolve (__dirname , './src/.env')})



  module.exports = {

    development:{
      client:"pg",
      connection:{
        database:"cand5",
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD
      },
      migrations:{
        directory:`${__dirname}/src/database/migrations`
      }
    },
  
  
  
  
};
