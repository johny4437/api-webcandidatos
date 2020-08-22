const QR = require('qrcode');
const path = require('path')

const generateQR = async text =>{
    try {
        await QR.toDataURL(text)
      } catch (err) {
        console.error(err)
      }
};

module.exports ={
    generateQR
}