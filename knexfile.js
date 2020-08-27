module.exports = {

  development:{
    client:"pg",
    connection:{
      database:"apicandidates",
      user:"postgres",
      password:"johny@123"
    },
    migrations:{
      directory:`${__dirname}/src/database/migrations`
    }
  },


};