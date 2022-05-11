const express = require("express");
const {
  GetRoom,
  CreateRoom,
  DeleteRoom,
  UpdateRoom,
  SearchRoom,
} = require("../controllers/Room");

const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

// room routs
router.get("/rooms", auth, hasAuth(6, 2), GetRoom);
router.post("/rooms", auth, hasAuth(6, 3), CreateRoom);
router.post("/rooms/search-room", auth, hasAuth(6, 3), SearchRoom);
router.patch("/rooms/:id", auth, hasAuth(6, 4), UpdateRoom);
router.delete("/rooms/:id", auth, hasAuth(6, 5), DeleteRoom);

module.exports = router;
