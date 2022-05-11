const express = require("express");
const {
  GetRole,
  CreateRole,
  UpdateRole,
  DeleteRole,
} = require("../controllers/Role");

const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/role", auth, hasAuth(1, 2), GetRole);
router.post("/role", auth, hasAuth(1, 3), CreateRole);
router.patch("/role/:id", auth, hasAuth(1, 4), UpdateRole);
router.delete("/role/:id", auth, hasAuth(1, 5), DeleteRole);

module.exports = router;
