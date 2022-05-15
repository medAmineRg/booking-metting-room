const { verifyToken } = require("../helpers/userHelper");
const Booking = require("../models/Booking");
const { getUserById, permissionExist } = require("../services/userEntity");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = verifyToken(token);
    if (decode.msg) {
      throw decode.msg;
    }
    const user = await getUserById(decode.userId);
    if (!user) {
      throw "Invalid user";
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json(e);
  }
};

const hasAuth = (menu, per) => {
  return async (req, res, next) => {
    try {
      const response = await permissionExist(req.user.idRole, per, menu);
      if (response) {
        next();
      } else {
        return res.status(401).send({
          code: "401",
          status: "unauthorized",
          message: "You dont have authorization to do that!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        code: "400",
        status: "error",
        message: error.errors[0].message || "Something went wrong!",
      });
    }
  };
};

module.exports = { auth, hasAuth };
