const express = require("express");
const {
  GetRole,
  CreateRole,
  UpdateRole,
  DeleteRole,
} = require("../controllers/Role");

const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/role", auth, hasAuth(2, 2), GetRole);
router.post("/role", auth, hasAuth(2, 3), CreateRole);
router.patch("/role/:id", auth, hasAuth(2, 4), UpdateRole);
router.delete("/role/:id", auth, hasAuth(2, 5), DeleteRole);

module.exports = router;
