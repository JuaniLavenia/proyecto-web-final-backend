const express = require("express");
const { login, register } = require("../controllers/auth.controller");
const { body } = require("express-validator");
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
			.withMessage("La contraseña es requerida")
			.isLength(6)
			.withMessage("La contraseña tiene que tener 6 caracteres o más")
			.custom((value, { req }) => value === req.body.password_confirmation)
			.withMessage("Las contraseñas no coincide"),
	],
	register
);

module.exports = router;
