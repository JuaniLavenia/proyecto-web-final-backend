const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res
				.status(403)
				.json({ error: "El correo y/o la contraseña son incorrectos" });
		}

		const passwordCorrecto = await user.comparePassword(password);
		if (!passwordCorrecto) {
			return res
				.status(403)
				.json({ error: "El correo y/o la contraseña son incorrectos" });
		}

		const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ login: true, userId: user.id, token });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

const register = async (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(422).json({ errors: result.array() });
	}

	const { email, password } = req.body;

	try {
		const user = new User({
			email,
			password,
		});

		await user.save();

		res.json({ register: true, user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = {
	login,
	register,
};
