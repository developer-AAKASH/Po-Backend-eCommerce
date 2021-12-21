const User = require("../models/User");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/CookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

// exports.signUp = BigPromise( async( error, request, response, next ))
exports.signUp = BigPromise( async( request, response, next )=>{

    if( !request.files ){
        return next( new CustomError("Photo is required for signup...", 400 ));
    }

    const { userName, email, password } = request.body;

    if( !email || !userName || !password ){
        return next( new CustomError("Username, email and password are required !!", 400 ));
    }

    let file = request.files.photo;
    const imageResult = await cloudinary.v2.uploader.upload( file.tempFilePath, {
        folder: "ecommerce_users",
        width: 150,
        crop: "scale"
    });

    const user = await User.create({
        userName,
        email,
        password,
        photo: {
            id: imageResult.public_id,
            securedURL: imageResult.secure_url
        }
    });

    await cookieToken( user, response );
});