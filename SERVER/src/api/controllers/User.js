const {
  sendEmail,
  generateHashPass,
  generateToken,
  verifyToken,
} = require("../helpers/userHelper");
const {
  checkEmailExist,
  checkPhoneExist,
  activateUserAccout,
  checkIdentity,
  getUserByName,
} = require("../services/userEntity");

const Role = require("../models/Role");
const User = require("../models/User");

const GetUserByName = async (req, res) => {
  let users = await getUserByName(req.params.name);
  return res.status(200).json({
    status: "OK",
    message: users.length + " user found",
    users,
    code: 200,
    api: "/user/get-user-byname",
    method: "get",
  });
};

const RegisterUser = async (req, res) => {
  let { fullName, email, phone, password, idLoc, idRole } = req.body;
  const emailExistingMsg = await checkEmailExist(email);
  if (emailExistingMsg) {
    return res.status(400).json({
      status: "error",
      code: 400,
      api: "/users",
      message: "User Email Alreday exist. please login.",
      method: "POST",
    });
  }
  if (phone) {
    const phoneExistingMsg = await checkPhoneExist(phone);
    if (phoneExistingMsg) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        api: "users",
        method: "POST",
        message: "User Phone Alreday exist",
      });
    }
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      api: "users",
      method: "POST",
      message: "Password must be 8 character at least",
    });
  }

  password = generateHashPass(password);

  try {
    const user = await User.create({
      idLoc: 1,
      idRole: 2,
      email,
      fullName,
      password,
      phone,
    });
    const token = generateToken(user.idUser, "6 hours");
    try {
      await sendEmail(token, email, fullName);
      return res.status(201).json({
        status: "Pending",
        message:
          "You need to wait for the admin to activate your account. thankyou!",
        code: 201,
        api: "/users",
        method: "POST",
      });
    } catch (error) {
      return res.status(400).json({
        api: "/users",
        message:
          error.errors[0].message ||
          "Something went wrong. please contact the admin!",
        status: "error",
        code: 400,
        method: "POST",
      });
    }
  } catch (error) {
    return res.status(400).json({
      api: "/users",
      message: error.errors[0].message || "Something went wrong try again!",
      status: "error",
      code: "400",
      method: "POST",
    });
  }
};

const VerifyUser = async (req, res) => {
  const token = req.params.token;
  try {
    const tknRes = verifyToken(token);
    if (tknRes.msg) {
      return res.status(400).json(tknRes.msg);
    }
    await activateUserAccout(tknRes.userId);
    return res.status(200).send({
      status: "OK",
      message: "Account has Activated succefully",
      code: 200,
      api: "users/verify",
      method: "GET",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      api: "users/verify",
      message: "You had Activated the account ",
      method: "GET",
    });
  }
};

const LoginUser = async (req, res) => {
  const response = await checkIdentity(req.body.email, req.body.password);
  if (response.error) {
    return res.status(400).json(response);
  }
  res.status(200).json(response);
};

const LogoutUser = async (req, res) => {
  res.status(200).json({
    status: "Logout",
    msg: "Logout succefuly",
    code: "200",
    api: "/users/logout",
    method: "POST",
  });
};

const UpdateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = generateHashPass(req.body.password);
  }
  try {
    await User.update(req.body, {
      where: {
        idUser: req.params.id,
      },
    });
    res.status(200).json({
      status: "OK",
      message: "User was updated succefully",
      code: "200",
      api: "/users/:id",
      method: "UPDATE",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Something went wrong",
      code: "400",
      api: "users/:id/update",
      method: "PATCH",
    });
  }
};

const CreateUser = async (req, res) => {
  let { fullName, email, phone, password, idLoc, idRole } = req.body;

  const emailExistingMsg = await checkEmailExist(email);
  if (!isNaN(fullName)) {
    return res.status(400).json({
      api: "/users",
      message: "Fullname must contain only letters",
      status: "Error",
      code: 400,
      method: "POST",
    });
  }
  if (emailExistingMsg) {
    return res.status(400).json({
      api: "/users",
      message: "User Email Alreday exist. please login.",
      status: "Error",
      code: 400,
      method: "POST",
    });
  }
  if (phone) {
    const phoneExistingMsg = await checkPhoneExist(phone);
    if (phoneExistingMsg) {
      return res.status(400).json({
        api: "/users",
        message: "User Phone Alreday exist",
        status: "Error",
        code: 400,
        method: "POST",
      });
    }
  }

  password = generateHashPass(password);
  try {
    let user = await User.create({
      idLoc: 1,
      idRole,
      email,
      fullName,
      password,
      activation: true,
      phone,
    });
    user = JSON.stringify(user);
    const modifiedUser = JSON.parse(user);
    const fixedUser = await User.findOne({
      where: {
        idUser: modifiedUser.idUser,
      },
      attributes: ["idUser", "email", "fullName", "phone", "activation"],
      include: Role,
    });
    return res.status(201).json({
      response: fixedUser,
      message: "New user has been created succefully",
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      api: "/users",
      message: error.errors[0].message,
      status: "Error",
      method: "POST",
    });
  }
};

const ActiveAcount = async (req, res) => {
  try {
    const activateAccount = await User.update(
      { activation: true },
      {
        where: {
          idUser: req.params.id,
        },
      }
    );
    return res.status(200).send({
      api: "/users/:id/active",
      message: "User activated succefully",
      status: "Error",
      code: 200,
      method: "POST",
    });
  } catch (e) {
    return res.status(400).json({
      api: "/users/:id/active",
      message: "Couldnt activate user try again",
      status: "Error",
      code: 400,
      method: "POST",
    });
  }
};

// delete user
const DeleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        idUser: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ id: req.params.id, message: "user deleted succefully" });
  } catch (error) {
    return res.status(400).json({
      api: "users",
      message: error.errors[0].message || "Can't delete user",
      status: "Error",
      code: 400,
      method: "POST",
    });
  }
};

const GetUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["idUser", "email", "fullName", "phone", "activation"],
      include: Role,
    });
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({
      api: "users",
      message: "Can't get user",
      status: "Error",
      code: 400,
      method: "GET",
    });
  }
};

module.exports = {
  RegisterUser,
  VerifyUser,
  LoginUser,
  LogoutUser,
  UpdateUser,
  GetUsers,
  CreateUser,
  DeleteUser,
  ActiveAcount,
  GetUserByName,
};
