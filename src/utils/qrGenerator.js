const QR = require('qrcode');
const path = require('path')
const knex = require('../database/connection');
async function generateQRCODE(text){
    try {
     const url =  await QR.toDataURL(text,{ errorCorrectionLevel: 'H', width: 600 })
        return  url
      } catch (err) {
        console.error(err)
      }
};



async function verifyLogin(username){
  // busca new name no banco
  let candidateAux = await knex('candidates').where('login', username).select('login')
          
  console.log(candidateAux)
  
  // caso exista
  if(candidateAux){

    let indiceLogin = 0
    do{
      indiceLogin++

      // busca no banco new name + - i
      candidateAux = await knex('candidates').where('login', username+'-'+indiceLogin).select('login')

    }while(candidateAux) //enquanto a consulta retorna true
    //ou seja, enquanto existe candidato com o login gerado, gera um novo login incrementando o contador
  }
  console.log(">> login gerado: "+username+'-'+indiceLogin)
  
  return username+'-'+indiceLogin


  //  let result =  await knex('candidates').where('login', username).select('login');
  //   if(result.length !== 0){
  //     let i = 0;
  //     let text = "";
  //     do{
  //       i = i + 1;
  //       text = username + i;

  //       return text;

  //     }while(result.length !== 0);
  //   }
    
   
   
    // let text = "";
      // let data = ""
      // let i = 0;
      // do{
      //     i = i + 1;
      //     text = username + i;
      //     const result = await knex('candidates').where('login', text).select('login');
      //     console.log(result);
          
      // } while(login);
    
}
  






module.exports ={
    generateQRCODE,
    verifyLogin
}