const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/User");
const { auth, hasAuth } = require("../middleware/auth");

const { yupValidation } = require("../middleware/validateMiddleware");

// const {
//   userSchemaReg,
//   userSchemaLogin,
// } = require("../Validations/userValidation");

router.get("/user", auth, hasAuth(5, 1), GetUsers);
router.get("/user/verify/:token", hasAuth(5, 2), VerifyUser);
router.get("/user/:name", auth, hasAuth(5, 2), GetUserByName);
router.post("/user", RegisterUser);
router.post("/user/:id/active", auth, ActiveAcount);
router.post("/user/add", auth, hasAuth(5, 3), CreateUser);
router.post("/user/login", LoginUser);
router.post("/user/logout", auth, LogoutUser);
router.patch("/user/:id/", auth, hasAuth(5, 4), UpdateUser);
router.delete("/user/:id", auth, hasAuth(5, 5), DeleteUser);

module.exports = router;
