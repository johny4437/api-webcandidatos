const path  = require('path');
require('dotenv').config({path:path.resolve (__dirname , './src/.env')})



  module.exports = {

    development:{
      client:process.env.DATABASE_CLIENT,
      connection:{
        port:process.env.DATABASE_PORT,
        database:process.env.DATABASE_NAME,
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
