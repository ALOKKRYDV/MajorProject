const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email : {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose);// adds username hashing salting and hashed password fields
module.exports = mongoose.model('User', userSchema);