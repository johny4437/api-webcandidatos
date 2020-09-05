const bcrypt = require('bcryptjs');

//FUNÇÃO PARA GERAR HASH DE PASSWORD
async function hashPassword(password){
    var salt = await  bcrypt.genSaltSync(8);
    var hash =  await bcrypt.hashSync(password);
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