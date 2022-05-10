const yup = require("yup");

const userSchemaReg = yup.object({
  fullName: yup.string().required(),
  phone: yup.string().min(10).max(10),
  password: yup.string().min(8).required(),
  email: yup.string().email().required(),
});

const userSchemaLogin = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

module.exports = { userSchemaReg, userSchemaLogin };
