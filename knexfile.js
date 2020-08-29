const path  = require('path');
require('dotenv').config({path:path.resolve (__dirname , './src/.env')})



  module.exports = {

    development:{
      client:"pg",
      connection:{
        database:"cand3",
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD
      },
      migrations:{
        directory:`${__dirname}/src/database/migrations`
      }
    },
  
  
  


  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './src/database/db.sqlite3'
  //   },
  //   migrations:{
  //     directory:'./src/database/migrations'
  //   }
  // }

  
};
