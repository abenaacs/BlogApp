const multer = require('multer');
const ApiError = require('./apiError');
const httpStatus = require('http-status');

const storage =  multer.diskStorage({
    destination(req, file, cb) {
        const filePath = `${__dirname}/../../uploads`; 
        cb(null, filePath);
    },
    filename(req, file, cb) {//how we want to name our files
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
    
});

module.exports =  multer({fileFilter(req, file, cb){
    const maxFileSize = 3*1024*1024;
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new ApiError(httpStatus.BAD_REQUEST,'Only images are allowed'), false);
    } else if(file.size>maxFileSize){
        cb(new ApiError(httpStatus.BAD_REQUEST,'File size should not exceed 3MB'), false);
    } else{
        cb(null, true);
    }
},})