const Joi = require("joi");
class Schema {
  static userSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(15).required(),
    confirmPassword: Joi.string()
      .required()
      .equal(Joi.ref("password"))
      .messages({ "any.only": "password does not match" }),
    phone: Joi.string().trim().required(),
  }).required();

  static loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  });
}
module.exports = Schema;
