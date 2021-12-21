const cookieToken = async ( user, response )=>{
    const token = await user.getJWTToken();

    const options = {
        expires: new Date( Date.now() + parseInt( process.env.COOKIE_TIME ) * 24 * 60 * 60 * 1000 ),
        httpOnly: true
    }

    user.password = undefined;

    console.log( "From Cookie Tokens: ", token );
    console.log( "From Cookie Tokens: ", token.toString() );

    response.status(200).cookie("token", token, options ).json({
       sucess: true,
       token,    
       user 
    });
};

module.exports = cookieToken;