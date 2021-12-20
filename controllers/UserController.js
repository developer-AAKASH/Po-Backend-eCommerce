const User = require("../models/User");
const BigPromise = require("../middlewares/bigPromise");

// exports.signUp = BigPromise( async( error, request, response, next ))
exports.signUp = BigPromise( async( request, response, next )=>{
    response.send("From User Signup route....")
});