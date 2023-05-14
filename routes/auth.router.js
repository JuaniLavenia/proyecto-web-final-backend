const express = require("express");
const { login, register } = require("../controllers/auth.controller");
const { body } = require("express-validator");
const { options } = require("./auth");
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
			.isLength({ min: 6, max: 12 })
			.withMessage("La contraseña debe tener entre 6 y 12 caracteres")
			.custom((value, { req }) => value === req.body.password_confirmation)
			.withMessage("Las contraseñas no coincide"),
	],
	register
);

module.exports = router;
