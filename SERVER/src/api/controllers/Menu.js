const Menu = require("../models/Menu");

const GetMenu = async (req, res) => {
  try {
    const response = await Menu.findAll();
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't get menus",
      code: 400,
      api: "menu",
      method: "GET",
    });
  }
};

const CreateMenu = async (req, res) => {
  const { nameMenu, Path, component } = req.body;
  try {
    const response = await Menu.create({ nameMenu, Path, component });
    return res
      .status(201)
      .json({ response, message: "Menu was Created succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't create menus",
      code: 400,
      api: "menu",
      method: "POST",
    });
  }
};

const UpdateMenu = async (req, res) => {
  delete req.body.id;
  try {
    const response = await Menu.update(req.body, {
      where: {
        idMenu: req.params.id,
      },
    });
    return res
      .status(201)
      .send({ response, message: "Menu was updated succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't update menus",
      code: 400,
      api: "menu",
      method: "PATCH",
    });
  }
};

const DeleteMenu = async (req, res) => {
  console.log(req.params.id);
  try {
    const response = await Menu.destroy({
      where: {
        idMenu: req.params.id,
      },
    });
    return res
      .status(201)
      .json({ id: req.params.id, message: "Menu was deleted succefully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Error",
      message: "Can't delete menus",
      code: 400,
      api: "menu",
      method: "DELETE",
    });
  }
};

module.exports = {
  GetMenu,
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
};
