const crypto = require('crypto');
const fs = require('fs');


exports.imageDecode = (imageData) =>{

    function decodeBase64Image (dataString) {

        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var response = {};
    
        if(matches.length !== 3){
            return new Error('Invalid Input String')
        }
        response.type = matches[1];
        response.data = Buffer.from(matches[2],'base64');
    
    
        return response
    
    
    }
    var imageTypeRegularExpression      = /\/(.*?)$/;      
    var seed                            = crypto.randomBytes(20);
     var uniqueSHA1String                = crypto
                                               .createHash('sha1')
                                                .update(seed)
                                                 .digest('hex');
    var base64Data = imageData;

    var imageBuffer = decodeBase64Image(base64Data);
    var userUploadedFeedMessagesLocation = '../../tmp/uploads';
    
    var uniqueRandomImageName = 'image-' + uniqueSHA1String;

    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    var userUploadedImagePath = userUploadedFeedMessagesLocation + uniqueRandomImageName +'.'+imageTypeDetected[1];

    try {
        fs.writeFile(userUploadedImagePath,imageBuffer.data,function() 
        {
          console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
        })
        
    } catch (error) {
        console.log('ERROR:', error);
    }

}

