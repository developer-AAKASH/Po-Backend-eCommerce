const mongoose = require("mongoose");

const connectToDB = ()=>{
    mongoose.connect( process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then( ()=>{
        console.log("DB Connected Succesfuly.......");
    })
    .catch( (error )=>{
        console.log("Error while connecting DB..." );
        console.log( error );
        process.exit(1);
    });
};

module.exports = connectToDB;