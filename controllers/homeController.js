const BigPromise = require("../middlewares/bigPromise");

exports.home = (request, response)=>{
    response.status(200).json({
        success: true,
        greeting: "Hello From API....",
    });
};

exports.homeWithBigPromise = BigPromise( async(request, response)=>{
    response.status(200).json({
        success: true,
        greeting: "Hello From API....",
    });
});

exports.homeWithTryAndCatch = async( request, response )=>{
    try {
        response.status(200).json({
            success: true,
            greeting: "Hello From API....",
        });
    } catch (error) {
        console.log( error );
    }
};