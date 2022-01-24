const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

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