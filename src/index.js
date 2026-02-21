// src/index.js

require("dotenv").config();

const express = require("express");

const path = require("path");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "..", "public");
app.use(express.static(assetsPath));

const routes = require("./routes/index.js");

app.use("/", routes.home);
app.use("/auth", routes.auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(
        `App is running on port - ${PORT}; visit - http://localhost:${PORT}`,
    );
});
