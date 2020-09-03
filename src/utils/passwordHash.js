const bcrypt = require('bcryptjs');

//FUNÇÃO PARA GERAR HASH DE PASSWORD
function hashPassword(password){
  //console.log('>> hash '+password)
    var salt = bcrypt.genSaltSync(8);
    var hash = bcrypt.hashSync(password);
    return {
        salt:salt,
        hash:hash,
     }
}

//FUNÇÃO PARA COMPARAR PASSWORD

function comparePassword(userPassword, dbPassword){
    return bcrypt.compare(userPassword, dbPassword)
}

module.exports ={
    hashPassword,
    comparePassword
    
}