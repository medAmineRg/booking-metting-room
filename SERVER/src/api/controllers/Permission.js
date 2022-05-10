const Permission = require("../models/Permission");

const GetPermision = async (req, res) => {
  try {
    const response = await Permission.findAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || " Can't get permission",
      code: "400",
      api: "permission",
      method: "GET",
    });
  }
};

const CreatePermision = async (req, res) => {
  const { namePer } = req.body;
  try {
    const response = await Permission.create({ namePer });
    return res
      .status(201)
      .json({ response, message: "Permission was created succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't create permission",
      code: "400",
      api: "permission",
      method: "POST",
    });
  }
};

const UpdatePermision = async (req, res) => {
  const { perName } = req.body;
  try {
    const response = await Permission.update(
      { namePer: perName },
      {
        where: {
          idPer: req.params.id,
        },
      }
    );
    return res
      .status(200)
      .send({ response, message: "Permission was updated succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't Update permission",
      code: "400",
      api: "permission",
      method: "PATCH",
    });
  }
};

const DeletePermision = async (req, res) => {
  try {
    const response = await Permission.destroy({
      where: {
        idPer: req.params.id,
      },
    });
    return res
      .status(200)
      .send({
        id: req.params.id,
        message: "Permission was deleted succefully",
      });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.errors[0].message || "Can't delete permission",
      code: "400",
      api: "permission",
      method: "DELETE",
    });
  }
};

module.exports = {
  GetPermision,
  CreatePermision,
  UpdatePermision,
  DeletePermision,
};
