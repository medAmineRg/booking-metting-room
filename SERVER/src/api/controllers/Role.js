const Role = require("../models/Role");

const GetRole = async (req, res) => {
  try {
    const response = await Role.findAll();
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.errors[0].message || "Can't get role",
      code: 400,
      api: "role",
      method: "GET",
    });
  }
};

const CreateRole = async (req, res) => {
  const { roleName } = req.body;
  try {
    const response = await Role.create({ nameRole: roleName });
    return res
      .status(201)
      .json({ response, message: "Role was created succefully" });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: error.errors[0].message || "Can't create role",
      code: 400,
      api: "/role",
      method: "POST",
    });
  }
};

const UpdateRole = async (req, res) => {
  const { nameRole } = req.body;
  try {
    const response = await Role.update(
      { nameRole: nameRole },
      {
        where: {
          idRole: req.params.id,
        },
      }
    );
    return res
      .status(200)
      .send({ response, message: "Role was updated succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't update role",
      code: 400,
      api: "role",
      method: "PATCH",
    });
  }
};

const DeleteRole = async (req, res) => {
  try {
    const response = await Role.destroy({
      where: {
        idRole: req.params.id,
      },
    });
    return res
      .status(201)
      .send({ id: req.params.id, message: "Role was deleted succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't delete role",
      code: 400,
      api: "role",
      method: "DELETE",
    });
  }
};

module.exports = {
  GetRole,
  CreateRole,
  UpdateRole,
  DeleteRole,
};
