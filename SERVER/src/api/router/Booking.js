const {
  getAllbookings,
  addBooking,
  updateBooking,
  getAllbookingsForOneUser,
  deleteBooking,
  cancelBooking,
  getBookingByIdRoomUser,
} = require("../controllers/Booking");

const { auth, hasAuth } = require("../middleware/auth");
const { yupValidation } = require("../middleware/validateMiddleware");

// const {
//   bookingSchema,
//   bookingUpdateSchema,
// } = require("../Validations/bookingValidation");

const express = require("express"),
  router = express.Router();

router.get("/bookings/all", auth, hasAuth(7, 2), getAllbookings);
router.get("/bookings", auth, hasAuth(7, 2), getAllbookingsForOneUser);
router.get(
  "/bookings/:idUser/:idRoom",
  auth,
  hasAuth(7, 2),
  getBookingByIdRoomUser
);
router.post("/bookings", auth, hasAuth(7, 3), addBooking);
router.patch("/bookings/:id", auth, hasAuth(7, 4), updateBooking);
router.patch("/bookings/:id/cancel", auth, hasAuth(7, 4), cancelBooking);
router.delete("/bookings/:id", auth, hasAuth(7, 5), deleteBooking);

module.exports = router;
