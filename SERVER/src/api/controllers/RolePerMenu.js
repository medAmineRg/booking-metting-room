const { throws } = require("assert");
const Menu = require("../models/Menu");
const Permission = require("../models/Permission");
const Role = require("../models/Role");
const Role_Permission_Menu = require("../models/Role_Permission_Menu");

const getAllRolePerMenu = async (req, res) => {
  try {
    const response = await Role_Permission_Menu.findAll({
      attributes: { exclude: ["idPer", "idMenu", "idRole"] },
      order: ["idRole"],
      include: [
        {
          model: Menu,
          as: "Menu",
        },
        {
          model: Permission,
          as: "Permission",
        },
        {
          model: Role,
          as: "Role",
        },
      ],
    });
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).send({
      status: "Error",
      code: 400,
      api: "role-Permission-Menu",
      method: "GET",
      message: error.errors[0].message || "Can't get role-per-menu",
    });
  }
};

const createRolePerMenu = async (req, res) => {
  const { idRole, idPer, idMenu } = req.body;

  try {
    if (!idRole || !idPer || !idMenu) {
      throw new Error("Must Provide all fields.");
    }
    const checkExistence = await Role_Permission_Menu.findOne({
      where: {
        idRole,
        idPer,
        idMenu,
      },
    });
    if (checkExistence) {
      throw new Error("Alereday exist.");
    }
    const response = await Role_Permission_Menu.create({
      idRole,
      idPer,
      idMenu,
    });
    return res.status(201).json({
      response,
      message: "role-permission-menu was Created succefully",
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      status: "Error",
      api: "role-permission-menu",
      method: "POST",
      message: error.message,
    });
  }
};

// const updateRolePerMenu = async (req, res) => {
//   try {
//     const response = await Role_Permission_Menu.update(req.body, {
//       where: {
//         idMenu: req.body.idMenu,
//         idRole: req.body.idRole,
//         idPer: req.body.idPer,
//       },
//     });
//     return res.status(201).send(response);
//   } catch (error) {
//     return res.status(400).send({
//       status: "error",
//       code: 400,
//       api: "/role-Permission-Menu",
//       method: "UPDATE",
//       message: "Something went wrong",
//     });
//   }
// };

const deleteRolePerMenu = async (req, res) => {
  const { body } = req.body;
  try {
    const response = await Role_Permission_Menu.destroy({
      where: {
        idMenu: body.idMenu,
        idRole: body.idRole,
        idPer: body.idPer,
      },
    });
    return res.status(200).send({
      idMenu: body.idMenu,
      idRole: body.idRole,
      idPer: body.idPer,
      message: "role-permission-menu was Deleted succefully",
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      code: 400,
      api: "role-Permission-Menu",
      method: "DELETE",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllRolePerMenu,
  createRolePerMenu,
  // updateRolePerMenu,
  deleteRolePerMenu,
};
