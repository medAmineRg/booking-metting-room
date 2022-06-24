const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const usersRouter = require("./router/User");
const bookingsRouter = require("./router/Booking");
const permissionRouter = require("./router/Permission");
const RoleRouter = require("./router/Role");
const MenuRouter = require("./router/Menu");
const RolePerMenuRouter = require("./router/RolePerMenu");
const RoomRouter = require("./router/Room");
const VideoRouter = require("./router/VideoChat")

// const { lookingForNonCacledToCancel } = require("./helpers/nodeCron");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/api/public")));

app.use(usersRouter);
app.use(bookingsRouter);
app.use(permissionRouter);
app.use(RoleRouter);
app.use(MenuRouter);
app.use(RolePerMenuRouter);
app.use(RoomRouter);
app.use(VideoRouter);


app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
