const express = require("express");
const router = express.Router();

const Producto = require("../models/Producto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Obtener los elementos del carrito del usuario actual
router.get("/carrito", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ").pop();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { uid } = payload;
    const user = await User.findById(uid).populate("carrito.producto");

    res.status(200).json(user.carrito);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener los elementos del carrito" });
  }
});

// Agregar un elemento al carrito del usuario actual
router.post("/carrito", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ").pop();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { uid } = payload;
    const { productoId } = req.body;

    // Verificar que el producto existe
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    // Agregar el producto al carrito del usuario
    const user = await User.findById(uid);
    const item = user.carrito.find((item) => item.producto == productoId);
    if (item) {
      item.cantidad++;
    } else {
      user.carrito.push({ producto: productoId, cantidad: 1 });
    }

    await user.save();
    res.status(201).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al agregar el producto al carrito" });
  }
});

// Eliminar un elemento del carrito del usuario actual
router.delete("/carrito/:productoId", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ").pop();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { uid } = payload;
    const { productoId } = req.params;

    const user = await User.findById(uid);
    const item = user.carrito.find((item) => item.producto == productoId);
    if (!item) {
      return res
        .status(400)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    const index = user.carrito.indexOf(item);
    user.carrito.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el producto del carrito" });
  }
});
