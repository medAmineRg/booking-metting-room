const express = require("express");
const { call, getAllVirtualRooms } = require("../controllers/VideoChat");
const router = express.Router();

router.get("/video-call/:id", call);
router.get("/video-call", getAllVirtualRooms);

module.exports = router;
