const {
  getAllRolePerMenu,
  createRolePerMenu,
  // updateRolePerMenu,
  deleteRolePerMenu,
} = require("../controllers/RolePerMenu");
const { auth, hasAuth } = require("../middleware/auth");

const express = require("express"),
  router = express.Router();

router.get("/role-permission-menu", auth, hasAuth(5, 2), getAllRolePerMenu);
router.post("/role-permission-menu", auth, hasAuth(5, 3), createRolePerMenu);
// router.patch("/role-permission-menu", auth, hasAuth(5, 4), updateRolePerMenu);
router.delete("/role-permission-menu", auth, hasAuth(5, 5), deleteRolePerMenu);

module.exports = router;
