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
app.use( fileUpload() );

// Morgan middlewares...
app.use( morgan("tiny") );

// Swagger Middlewares...
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ));

// Routers...
const homeRoutes = require("./routes/home");

// Router middlewares...
app.use("/api/v1", homeRoutes );

// export app js
module.exports = app;