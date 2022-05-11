const express = require("express");
const {
  GetMenu,
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
} = require("../controllers/Menu");
const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/menu", auth, hasAuth(3, 2), GetMenu);
router.post("/menu", auth, hasAuth(3, 3), CreateMenu);
router.patch("/menu/:id", auth, hasAuth(3, 4), UpdateMenu);
router.delete("/menu/:id", auth, hasAuth(3, 5), DeleteMenu);

module.exports = router;
