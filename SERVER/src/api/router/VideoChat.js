const express = require("express");
const { call } = require("../controllers/VideoChat");
const router = express.Router();


router.get("/video-call/:id", call);

module.exports = router