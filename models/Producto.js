const { Schema, model } = require("mongoose");

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
  capacity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
});

module.exports = model("Producto", schema);
