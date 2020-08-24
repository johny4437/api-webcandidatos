module.exports = {

  development:{
    client:"pg",
    connection:{
      database:"candidates",
      user:"postgres",
      password:"johny@123"
    },
    migrations:{
      directory:`${__dirname}/src/database/migrations`
    }
  },


};