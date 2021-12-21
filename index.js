require("dotenv").config(); // why !?
const app = require("./app");
const connectToDB = require("./configurations/DB-Connections");
const cloudinary = require("cloudinary");

// Connecting to Database.....
connectToDB();

// Connect to Cloudinary.......
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const PORT = process.env.SERVER_PORT;

app.listen( PORT, ()=>{
    console.log(`App is Running on PORT ${PORT}....`);
});