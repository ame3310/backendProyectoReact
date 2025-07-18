const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  categoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      "array.base": "Debes proporcionar un array de categorías",
      "array.min": "Debe incluir al menos una categoría",
      "any.required": "El campo categoryIds es obligatorio",
    }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow("", null).optional(),
  price: Joi.number().positive().optional(),
  categoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .optional(),
  removeImages: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .optional(),
});

module.exports = { productSchema, updateProductSchema };
