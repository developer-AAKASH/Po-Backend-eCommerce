const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const { request } = require("express");

exports.isSignedIn = BigPromise( async( request, response, next )=>{
    const token = request.cookies.token || request.header("Authorization").replace("Bearer ", "");

    if( !token ){
        return next( new CustomError("Login First to access this page !!", 401 ));
    }

    const decodedUser = jwt.verify( token, process.env.JWT_SECRET );

    console.log( decodedUser );

    request.user = await User.findById( decodedUser.id );

    next();
});

exports.isRoleMatching = (...roles)=>{
    return( request, response, next )=>{
        if( !roles.includes( request.user.role ) ){
            return next( new CustomError("You are not allowed for this resource", 403 ) );
        }
        next();
    }

    // if( request.user.role === "admin" ){
    //     next();
    // }
};