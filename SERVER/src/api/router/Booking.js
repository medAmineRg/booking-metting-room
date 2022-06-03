const {
  getAllbookings,
  addBooking,
  updateBooking,
  getAllbookingsForOneUser,
  deleteBooking,
  cancelBooking,
  getBookingByIdRoomUser,
  BookingByName,
} = require("../controllers/Booking");

const { auth, hasAuth, hasUpdAuth } = require("../middleware/auth");
const { yupValidation } = require("../middleware/validateMiddleware");

const {
  bookingSchema,
  bookingUpdateSchema,
} = require("../Validations/bookingValidation");

const express = require("express"),
  router = express.Router();

router.get("/bookings/all", auth, hasAuth(8, 2), getAllbookings);
router.get("/bookings/:title", auth, hasAuth(8, 2), BookingByName);
router.get("/bookings", auth, hasAuth(8, 2), getAllbookingsForOneUser);
router.get(
  "/bookings/:idUser/:idRoom",
  auth,
  hasAuth(8, 2),
  getBookingByIdRoomUser
);
router.post("/bookings", auth, hasAuth(8, 3), addBooking);
router.patch("/bookings/:id", auth, hasUpdAuth(), updateBooking);
router.patch("/bookings/:id/cancel", auth, hasAuth(8, 4), cancelBooking);
router.delete("/bookings/:id", auth, hasAuth(8, 5), deleteBooking);

module.exports = router;
