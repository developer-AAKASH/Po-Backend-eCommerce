require("dotenv").config(); // why !?
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Swagger Configuration....
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();

// Regular Middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies and fileUpload Middlewares...
app.use( cookieParser() );
app.use( fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}) );

app.set("view engine", "ejs");

// Morgan middlewares...
app.use( morgan("tiny") );

// Swagger Middlewares...
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ));

// Routers...
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");

// Router middlewares...
app.use("/api/v1", homeRoutes );
app.use("/api/v1", userRoutes );

app.get("/signuptest", ( request, response )=>{
    response.render("signuptest")
});

// export app js
module.exports = app;