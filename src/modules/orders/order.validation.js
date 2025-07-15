const Joi = require("joi");

const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required().messages({
          "any.required": "El ID del producto es obligatorio",
          "number.base": "El ID del producto debe ser un número válido",
        }),
        quantity: Joi.number().integer().positive().default(1).messages({
          "number.base": "La cantidad debe ser un número entero positivo",
          "number.positive": "La cantidad debe ser mayor a cero",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Debes enviar una lista de productos",
      "array.min": "Debes incluir al menos un producto en la orden",
      "any.required": 'El campo "items" es obligatorio',
    }),
});

module.exports = { orderSchema };
