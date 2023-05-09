const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");

//creamos el storage para guardar la imagen
const storage = multer.diskStorage({ //storage de disco
  destination: function (req, file, cb) {
    cb(null, "./public/img/productos"); //ubicacion donde se va a guarda
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); //nombre original del archivo
  },
});
//este va a subir el archivo
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

//vamos a traer un solo producto, usa findById
router.get("/productos/:id", async (req, res) => {
  try {
    //aqui busco los datos dentro de la base
    //esto es una promesa y se trae por el ID
    const producto = await Producto.findById(req.params.id);
    console.log(producto);
    // estos datos ya viene de la base de datos
    res.json(producto);
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
      ability: req.body.ability,
      category: req.body.category,
      
    });
    //guardamos
    const result = await producto.save();
    // console.log(result)
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

//vamos a actualizar un registro
router.put("/productos/:id", upload.single("image"), async (req, res) => {
  // console.log(req.body)
  try {
    //modifica un parametro por ID
    const result = await Producto.findByIdAndUpdate(
      req.params.id, //aqui lo va a buscar
      {
        name: req.body.name,
        description: req.body.description,
        image: req.file.filename,
        price: req.body.price,
        stock: req.body.stock,
        ability: req.body.ability,
        category: req.body.category,   
      },
      {
        new: true,
      }
    ); //trae el registro que acaba de crear
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});


//vamos a borrar un registro
router.delete("/productos/:id", async (req, res) => {
  // console.log(req.body)
  try {
    //busca y brorra el elemento
    const result = await Producto.findByIdAndDelete(req.params.id);
    const msg = result ? "Registro borrado" : "No se encontro el registro";
    res.json({ msg }); //me trae el registro que borro
  } catch (err) {
    console.log(err);
  }
});

//Ruta de buscador
router.get("/productos/search/:filter", async (req, res) => {
  const { filter } = req.params
  try {
    const productos = await Producto.find({ name: { $regex:filter } });

    res.json(productos);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
