const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors()); // Libera o front-end Vite para buscar os dados!
app.use(express.json());
app.use(routes);

module.exports = app;