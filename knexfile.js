module.exports = {

  development:{
    client:"pg",
    connection:{
      database:"candidates",
      user:"postgres",
      password:"root"
    },
    migrations:{
      directory:`${__dirname}/src/database/migrations`
    }
  },


};