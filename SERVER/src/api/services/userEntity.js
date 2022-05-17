const asso = require("../models")();
const { Op } = require("sequelize");
const User = require("../models/User");
const {
  comparePassword,
  generateToken,
  generateMenusPermission,
} = require("../helpers/userHelper");
const Role = require("../models/Role");
const Menu = require("../models/Menu");
const Role_Permission_Menu = require("../models/Role_Permission_Menu");
const Permission = require("../models/Permission");

const getUserByName = async (fullName) => {
  const users = await User.findAll({
    where: {
      fullName: {
        [Op.like]: !(fullName === "all") ? `%${fullName}%` : "%",
      },
    },
    attributes: ["idUser", "email", "fullName", "phone", "activation"],
    raw: true,
    include: Role,
  });
  return users;
};

const getMenus = async (idRole) => {
  const menu = await Role_Permission_Menu.findAll({
    attributes: ["idPer"],
    where: {
      idRole: idRole,
    },
    include: [
      {
        model: Menu,
        as: "Menu",
      },
    ],
  });
  let STRMENU = JSON.stringify(menu, null, 2);

  return JSON.parse(STRMENU);
};

const getPer = async (permissions) => {
  const per = await Permission.findAll({
    where: {
      idPer: permissions,
    },
  });
  let STRPER = JSON.stringify(per, null, 2);
  return JSON.parse(STRPER);
};

const getPerId = (obj) => {
  const idPer = [];
  obj.forEach((ea) => {
    if (!idPer.includes(ea.idPer)) {
      idPer.push(ea.idPer);
    }
  });

  return idPer;
};

const getUserById = async (id) => {
  try {
    const res = await User.findOne({
      where: {
        idUser: id,
      },
      raw: true,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

const checkEmailExist = async (email) => {
  const user = await User.findOne({
    attributes: [
      "idUser",
      "fullName",
      "activation",
      "idRole",
      "email",
      "password",
    ],
    where: {
      email: email,
    },
    include: [{ model: Role, as: "Role" }],
  });
  if (user) {
    return user;
  }
};
const checkPhoneExist = async (phone) => {
  const user = await User.findOne({
    where: {
      phone: phone,
    },
  });
  if (user) {
    return user;
  }
};

const activateUserAccout = async (id) => {
  try {
    await User.update(
      { activation: true },
      {
        where: {
          idUser: id,
        },
      }
    );
    return;
  } catch (error) {
    return error;
  }
};

const checkIdentity = async (email, password) => {
  try {
    const getUserByEmail = await checkEmailExist(email);

    if (!getUserByEmail)
      return {
        status: "Error",
        api: "users/login",
        message: "Email doesn't exist!",
        code: 401,
        method: "POST",
        error: true,
      };

    const checkForPass = await comparePassword(
      password,
      getUserByEmail.password
    );

    if (!checkForPass)
      return {
        error: true,
        status: "error",
        code: 401,
        message: "Email or Password might be wrong",
        api: "users/login",
        method: "POST",
      };

    if (!getUserByEmail.activation)
      return {
        error: true,
        error: 401,
        api: "users/login",
        message:
          "Please wait for the admin to activate your account. if not so then contact him!",
        method: "POST",
      };
    const token = generateToken(getUserByEmail.idUser);
    const jsonUser = JSON.stringify(getUserByEmail, null, 2);
    const parseUser = JSON.parse(jsonUser);
    const allMenus = await getMenus(parseUser.idRole);
    const allPer = await getPer(getPerId(allMenus));
    const menuAndPer = generateMenusPermission(
      parseUser.Role,
      allMenus,
      allPer
    );
    parseUser.Role.Menu = [...menuAndPer];

    delete parseUser.password;
    delete parseUser.idRole;

    return { user: parseUser, token };
  } catch (error) {
    return {
      error: true,
    };
  }
};

const permissionExist = async (role, per, menu) => {
  const response = await Role_Permission_Menu.findOne({
    where: {
      idRole: role,
      idMenu: {
        [Op.or]: [menu],
      },
      idPer: {
        [Op.or]: [per, 6],
      },
    },
    raw: true,
  });
  return response;
};

module.exports = {
  checkEmailExist,
  checkPhoneExist,
  activateUserAccout,
  permissionExist,
  checkIdentity,
  getUserById,
  getMenus,
  getUserByName,
};
