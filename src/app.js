const { AppError } = require("./middlewares/error-handler");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

const routes = require("./app.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    message,
    ...(err.code && { code: err.code }),
  });
});

module.exports = app;
