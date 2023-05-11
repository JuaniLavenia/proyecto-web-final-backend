require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("mongoose conectado"))
	.catch((err) => console.log(err));

app.use(express.json()); // req.body

const cors = require("cors");

app.get("/", (req, res) => {
	res.send("Hola");
});

app.use(cors());
app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/productos"));
// app.use("/api", require("./routes/auth.router"));
app.use("/api", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
