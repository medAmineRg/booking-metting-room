const express = require("express");
const {
  GetMenu,
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
} = require("../controllers/Menu");
const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/menu", auth, hasAuth(4, 2), GetMenu);
router.post("/menu", auth, hasAuth(4, 3), CreateMenu);
router.patch("/menu/:id", auth, hasAuth(4, 4), UpdateMenu);
router.delete("/menu/:id", auth, hasAuth(4, 5), DeleteMenu);

module.exports = router;
