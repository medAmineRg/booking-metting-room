const express = require("express");
const {
  GetRoom,
  CreateRoom,
  DeleteRoom,
  UpdateRoom,
  SearchRoom,
  GetRoomByName,
} = require("../controllers/Room");

const { auth, hasAuth } = require("../middleware/auth");
const router = express.Router();

// room routs
router.get("/room", auth, hasAuth(7, 2), GetRoom);
router.get("/room/:name", auth, hasAuth(7, 2), GetRoomByName);
router.post("/room", auth, hasAuth(7, 3), CreateRoom);
router.post("/room/search-room", auth, hasAuth(7, 3), SearchRoom);
router.patch("/room/:id", auth, hasAuth(6, 4), UpdateRoom);
router.delete("/room/:id", auth, hasAuth(6, 5), DeleteRoom);

module.exports = router;
