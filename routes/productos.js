const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/productos", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ").pop();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { uid } = payload;

    const productos = await Producto.find();
    const user = User.findById(uid);

    res.json(productos, user);
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

router.post("/productos/", async (req, res) => {
  try {
    const producto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      stock: req.body.stock,
    });
    const result = await producto.save();
    console.log(result);
    res.send("Nuevo productos");
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
