const User = require("../models/User");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/CookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/EmailHelper");
const crypto = require("crypto");

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

exports.signIn = BigPromise( async( request, response, next )=>{
    const { email, password } = request.body;

    // Check for presense of email and password
    if( !email || !password ){
        return next( new CustomError("Please provide email and password", 400 ));
    }

    const user = await User.findOne({ email }).select("+password");

    if( !user ){
        return next( new CustomError("Email and password doesn't exist !!", 400 ));
    }

    const isPasswordCorrect = await user.isRightPassword( password );

    if( !isPasswordCorrect ){
        return next( new CustomError("Password is not correct !!", 400 ));
    }

    await cookieToken( user, response );
});

exports.signOut = BigPromise( async( request, response, next )=>{
    response.cookie( "token", null, {
        expires: new Date( Date.now() ),
        httpsOnly: true
    });

    response.status(200).json({
        success: true,
        message: "Signout succesfuly !!"
    });
});

exports.forgotPassword = BigPromise( async( request, response, next )=>{
    const { email } = request.body;

    const user = await User.findOne({ email });

    if( !user ){
        return next( new CustomError("Email not found !!", 400 ));
    }

    const forgotPasswordToken = user.getResetpasswordToken();

    await user.save({ validateBeforeSave: false });

    const forgotPasswordUrl = `${request.protocol}://${request.get("host")}/api/v1/password/reset/${forgotPasswordToken}`;

    const message = `Copy paste this link in your browser and hit enter !!! \n \n ${forgotPasswordUrl}`;

    try{
        const options = {
            email: user.email,
            subject: "MyECommerce Password reset email !!",
            message,
        };

        await mailHelper({
            email: user.email,
            subject: "MyECommerce Password reset email !!",
            message,
        });

        await response.status(200).json({
            success: true,
            message: "Email sent succesfuly !!"
        });
    } catch( error ){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        return next( new CustomError( error.message, 500 ));
    }


});

exports.resetPassword = BigPromise( async( request, response, next )=>{
    const token = request.params.token;

    console.log("Token::::", token );

    const encryptedToken = crypto
    .createHash("sha256").
    update(token).
    digest("hex");

    console.log("Encrypted Token::", encryptedToken );

    const user = await User.findOne({ 
        resetPasswordToken: encryptedToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    console.log( "User:::::", user);

    if( !user ){
        return next( new CustomError("Token is invalid or expired !!", 400 ));
    }

    if( request.body.password !== request.body.confirmPassword ){
        return next( new CustomError("Password and Confirm Password is not matched !!", 400 ));
    }

    user.password = request.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    // send a JSON response or send token !!
    cookieToken( user, response );

});

exports.getLoggedInUserDetails = BigPromise( async( request, response, next )=>{    
    const user = await User.findById( request.user.id );

    console.log(request.user.id );

    // console.table( user );

    response.status( 200 ).json({
        success: true,
        user
    });
});

exports.changeUserPassword = BigPromise( async( request, response, next )=>{
    const userId = request.user.id;

    const user = await User.findById( userId ).select("+password");

    const isCorrectOldPassword = await user.isRightPassword( request.body.oldPassword );

    if( !isCorrectOldPassword ){
        return next( new CustomError("Old password is incorrect", 400 ));
    }

    user.password = request.body.password;

    await user.save();

    cookieToken( user, response );
});

exports.updateUser = BigPromise( async( request, response, next )=>{

    // Check for email and name in body !!
    if( !request.body.email || !request.body.userName ){
        return next( new CustomError("email and password is required for update !!", 401 ));
    }

    const newData = {
        userName: request.body.userName,
        email: request.body.email
    };

    if( request.files ){
        // Delete the existing one and add new one !!
        const user = await User.findById( request.user.id );

        const imageId = user.photo.id;

        // Deleting the existing image using imageId !!
        const resp = await cloudinary.v2.uploader.destroy( imageId );

        const result = await cloudinary.v2.uploader.upload(request.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale",
        });

        newData.photo = {
            id: result.public_id,
            securedURL: result.secure_url
        };
    }

    const user = await User.findOneAndUpdate( request.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    } );

    response.status(200).json({
        success: true,
        user
    });
});