const express = require("express");
const {
  GetPermision,
  CreatePermision,
  UpdatePermision,
  DeletePermision,
} = require("../controllers/Permission");
const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/permission", auth, hasAuth(3, 2), GetPermision);
router.post("/permission", auth, hasAuth(3, 3), CreatePermision);
router.patch("/permission/:id", auth, hasAuth(3, 4), UpdatePermision);
router.delete("/permission/:id", auth, hasAuth(3, 5), DeletePermision);

module.exports = router;
