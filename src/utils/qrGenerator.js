const QR = require('qrcode');
const path = require('path')

async function generateQRCODE(text){
    try {
     const url =  await QR.toDataURL(text,{ errorCorrectionLevel: 'H' })
        return  url
      } catch (err) {
        console.error(err)
      }
};

module.exports ={
    generateQRCODE
}