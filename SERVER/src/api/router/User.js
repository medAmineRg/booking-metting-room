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
} = require("../controllers/User");
const { auth, hasAuth } = require("../middleware/auth");

const { yupValidation } = require("../middleware/validateMiddleware");

// const {
//   userSchemaReg,
//   userSchemaLogin,
// } = require("../Validations/userValidation");

router.get("/users", auth, hasAuth(3, 2), GetUsers);
router.get("/users/verify/:token", hasAuth(3, 2), VerifyUser);
router.post("/users", RegisterUser);
router.post("/users/:id/active", auth, ActiveAcount);
router.post("/users/add", auth, hasAuth(3, 3), CreateUser);
router.post("/users/login", LoginUser);
router.post("/users/logout", auth, LogoutUser);
router.patch("/users/:id/", auth, hasAuth(3, 4), UpdateUser);
router.delete("/users/:id", auth, hasAuth(3, 5), DeleteUser);

module.exports = router;
