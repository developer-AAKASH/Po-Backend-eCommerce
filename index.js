require("dotenv").config(); // why !?
const app = require("./app");

const PORT = process.env.SERVER_PORT;

app.listen( PORT, ()=>{
    console.log(`App is Running on PORT ${PORT}....`);
});