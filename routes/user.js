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
    updateUser,
    adminGetAllUsers,
    adminGetOneUser,
    adminUpdateOneUser,
    adminDeleteOneUser,
    managerGetAllUsers
} = require("../controllers/UserController");

const { isSignedIn, isRoleMatching } = require("../middlewares/user");

router.route("/signup").post( signUp );

router.route("/signin").post( signIn );

router.route("/signout").get( signOut );

router.route("/forgotpassword").post( forgotPassword );

router.route("/password/reset/:token").post( resetPassword );

router.route("/userdashboard").get( isSignedIn, getLoggedInUserDetails );

router.route("/password/update").post( isSignedIn, changeUserPassword );

router.route("/userdashboard/update").post( isSignedIn, updateUser );

// Admin specific routes.
router.route("/admin/users").get( isSignedIn, isRoleMatching("Admin"), adminGetAllUsers );
router.route("/admin/user/:userId")
    .get( isSignedIn, isRoleMatching("Admin"), adminGetOneUser )
    .put( isSignedIn, isRoleMatching("Admin"), adminUpdateOneUser )
    .delete( isSignedIn, isRoleMatching("Admin"), adminDeleteOneUser );

// Manager specific routes.
router.route("/manager/users").get( isSignedIn, isRoleMatching("Manager"), managerGetAllUsers );

module.exports = router;