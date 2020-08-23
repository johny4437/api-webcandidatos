const bcrypt = require('bcryptjs');

//FUNÇÃO PARA GERAR HASH DE PASSWORD
function hashPassword(password){
    var salt = bcrypt.genSalt(8);
    var hash = bcrypt.hash(password);
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