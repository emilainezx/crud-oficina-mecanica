const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const supabase = require('./config/supabase')

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(routes);

module.exports = app;