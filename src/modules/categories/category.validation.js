const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre de la categoría es obligatorio",
  }),
});

module.exports = { categorySchema };
