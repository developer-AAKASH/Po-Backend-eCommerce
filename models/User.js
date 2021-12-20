const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [ true, "Please provide a Username !!"],
        maxlength: [ 40, "Username should be under 40 characters !!"],
        minlength: [ 3, "Username should be of atleast 3 character !!"]
    },
    email: {
        type: String,
        required: [ true, "Please provide a email !!"],
        validator: [ validator.isEmail, "Please enter email in correct format !!" ],
        unique: [ true, "Email already exist !!"]
    },
    password: {
        type: String,
        required: [ true, "Please provide a password !!"],
        minlength: [ 8, "Password should be of atleast 8 character !!"],
        select: false, //this will not come when someone get user data for security purpose !!
    },
    role: {
        type: String,
        default: "User",
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        securedURL: {
            type: String, 
            required: true,

        }
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiry: {
        type: Date,
    },
    userCreatedAt: {
        type: Date,
        default: Date.now
    },

});

// Encrypt Password before save...
// This is hooks...not methods !!
UserSchema.pre('save', async function ( next ) {
    // Because we dont want to bcrypt the password everytime when the Model/User get updated !!
    if( !this.isModified("password") ){
        return next();
    }

    this.password = await bcrypt.hash( this.password, process.env.SALT_ROUND );
});

// Methods...........
// Validate Password with passed on user password....
UserSchema.methods.isRightPassword = async function ( userSendPassword ) {
    return await bcrypt.compare( userSendPassword, this.password );
};

// Create and Return JWT token
UserSchema.methods.getJWTToken = async function () {
    return jwt.sign({
        id: this._id,
        // email: this.email // and can be mudh more field addedd...
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRY
    });
}

// Generate Forgot/Reset password token...basically a string...
UserSchema.methods.getResetpasswordToken = function (params) {
    // Generate a long and random stirng....
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Getting a hash - make sure to get a hash on backend...
    this.resetPasswordToken = crypto.createHash( "sha256" ).update(resetToken).digest("hex");

    // Time of token...
    this.resetPasswordExpiry = Date.now() + process.env.RESET_PASSWORD_EXPIRY;

    return resetToken;
}

module.exports = mongoose.model("User", UserSchema);