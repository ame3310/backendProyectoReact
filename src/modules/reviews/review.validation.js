const Joi = require("joi");

const reviewSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "any.required": "El ID del producto es obligatorio",
    "number.base": "El ID del producto debe ser un número",
  }),

  rating: Joi.number().valid(0, 1, 2, 3, 4, 5).required().messages({
    "any.only": "El rating debe estar entre 0 y 5",
    "any.required": "El rating es obligatorio",
  }),

  comment: Joi.string().allow("", null).max(1000).messages({
    "string.max": "El comentario no puede superar los 1000 caracteres",
  }),
});

module.exports = {
  reviewSchema,
};
