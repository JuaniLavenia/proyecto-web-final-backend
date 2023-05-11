const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/login", async (req, res) => {
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
		res.json({ login: true, userId: user.id });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/register", async (req, res) => {
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
});

module.exports = router;
