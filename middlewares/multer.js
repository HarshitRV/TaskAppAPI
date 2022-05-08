const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new AppError(400, "Please upload an image file"));
        }   
        cb(undefined, true);
    },
    storage
});

module.exports = upload;