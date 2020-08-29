const QR = require('qrcode');
const path = require('path')
const knex = require('../database/connection');
async function generateQRCODE(text){
    try {
     const url =  await QR.toDataURL(text,{ errorCorrectionLevel: 'H' })
        return  url
      } catch (err) {
        console.error(err)
      }
};



async function verifyLogin(username){

   let result =  await knex('candidates').where('login', username).select('login');
    if(result.length !== 0){
      let i = 0;
      let text = "";
      do{
        i = i + 1;
        text = username + i;

        return text;

      }while(result.length !== 0);
    }
    
   
   
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