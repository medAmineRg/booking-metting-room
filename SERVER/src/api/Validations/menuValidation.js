const { object, string } = require("yup");

const menuSchema = object({
  nameMenu: string().min(3).max(30).required(),
  Path: string().min(3).max(30).required(),
  component: string().min(3).max(30).required(),
});

module.exports = {
  menuSchema,
};
