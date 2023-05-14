const express = require("express");
const { body } = require("express-validator");
const { login, register } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", login);

router.post(
	"/register",
	[
		body("email")
			.trim()
			.notEmpty()
			.withMessage("El correo es requerido")
			.isEmail()
			.withMessage("El correo es incorrecto"),
		body("password")
			.notEmpty()
			.trim()
			.isLength(6)
			.withMessage("La contraseña tiene que tener 6 o más caracteres"),
	],
	register
);

module.exports = router;
