const express = require("express");

const { login } = require("./auth.controller");

const router = express.Router();

// Login
router.post("/login", login);

module.exports = router;
