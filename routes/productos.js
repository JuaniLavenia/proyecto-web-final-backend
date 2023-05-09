const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");

//creamos el storage para guardar la imagen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/productos"); //ubicacion donde se va a guarda
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); //nombre original del archivo
  },
});
const upload = multer({ storage: storage });

//rutas
router.get("/productos", async (req, res) => {
  try {
    // const { authorization } = req.headers;
    // const token = authorization.split(" ").pop();
    // const payload = jwt.verify(token, process.env.JWT_SECRET);

    // const { uid } = payload;
    // const user = User.findById(uid);
    const productos = await Producto.find();

    res.json(productos);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
});

router.get("/productos/:id", async (req, res) => {
  try {
    const productos = await Producto.findById(req.params.id);
    console.log(productos);
    res.send("Id de productos");
  } catch (err) {
    console.log(err);
  }
});

//vamos a crear un solo producto
//upload sigle sube una sola imagen
router.post("/productos", upload.single("image"), async (req, res) => {
  console.log(req.body, req.file);
  try {
    //creamos un product
    const producto = new Producto({
      name: req.body.name,
      description: req.body.description,
      image: req.file.filename,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });
    const result = await producto.save();
    // console.log(result)
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.put("/productos/:id", async (req, res) => {
  try {
    const result = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/productos/:id", async (req, res) => {
  try {
    const result = await Producto.findByIdAndDelete(req.params.id);
    const msg = result ? "Registro Borrado" : "No se encontro el registro";
    res.json({ msg });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
