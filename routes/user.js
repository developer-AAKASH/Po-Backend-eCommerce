const express = require("express");
const router = express.Router();

const { 
    signUp, 
    signIn, 
    signOut, 
    forgotPassword, 
    resetPassword,
    getLoggedInUserDetails,
    changeUserPassword,
    updateUser
} = require("../controllers/UserController");

const { isSignedIn } = require("../middlewares/user");

router.route("/signup").post( signUp );

router.route("/signin").post( signIn );

router.route("/signout").get( signOut );

router.route("/forgotpassword").post( forgotPassword );

router.route("/password/reset/:token").post( resetPassword );

router.route("/userdashboard").get( isSignedIn, getLoggedInUserDetails );

router.route("/password/update").post( isSignedIn, changeUserPassword );

router.route("/userdashboard/update").post( isSignedIn, updateUser );

module.exports = router;