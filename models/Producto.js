//Primero traigo el esquema de mongoo db
const { Schema, model } = require("mongoose");

//el esquema es un objeto
const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  ability: {
    type: Number,
    required: true,
  },
  
  category: {
    type: String,
    required: true,
  },
  
});

//el modelo se llama Productos y viene de schema, luego lo exporto
module.exports = model("Producto", schema);
