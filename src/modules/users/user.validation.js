const Joi = require("joi");

const updateUserSchema = Joi.object({
  userName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede superar los 50 caracteres",
  }),
  password: Joi.string().min(6).max(100).optional().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede superar los 100 caracteres",
  }),
});

module.exports = {
  updateUserSchema,
};
