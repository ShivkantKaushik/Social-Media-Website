const mongoose = require('mongoose');

const multer = require("multer");
//because we will be setting the path where file is stored
const path = require('path');
//so this is the path where we will be storing all the DPs, avatar refers to DP
const AVATAR_PATH = path.join('/uploads/users/avatars');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    name: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    }
},{// whenever database is created or updated
    timestamps: true
});

let storage = multer.diskStorage({
    //there is a req, then there is a file from that req, then there is CB , Call Back function 
    destination: function (req, file, cb) {
        //first argument is null, then there is path where the file would be stored
        // __dirname gives current directory
      cb(null, path.join(__dirname,'..', AVATAR_PATH));
    },
    // filename is given because, sometimes users have same name, then same file name, so it will
    // append epoc time to filename, to make it unique named
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //file.fieldname would give output avatar
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

//static function for userSchema means function would available for whole model User
//, multer syntax from documentions, .single means
// only one file is to be uploaded, means normally we can also upload array of files
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
// again static function, so that AVATAR_PATH variable gets publicly available
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;