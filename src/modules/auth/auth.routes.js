const express = require("express");
const router = express.Router();
const { verifyRefreshToken } = require("../../utils/jwt");
const { signup, login, refresh, logout } = require("./auth.controller");

const validate = require("../../middlewares/validate.middleware");
const requireAuth = require("../../middlewares/requireAuth.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const { signupSchema, loginSchema } = require("./auth.validation");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", autoRefresh, requireAuth, logout);

module.exports = router;
