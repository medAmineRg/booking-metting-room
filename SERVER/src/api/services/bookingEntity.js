const db = require("../../config/db");
const { QueryTypes, Op } = require("sequelize");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

const checkForBookingAvailability = async (begin, end, room, idBook = -1) => {
  const booking = await db.query(
    `SELECT "idBooking", "Creator"
      FROM "Booking"
      WHERE tstzrange("beginAt", "endAt") 
      && ('[${begin}, ${end})'::tstzrange)
      AND "idRoom" = :room
      AND "idBooking" != ${idBook}
      limit 1`,
    { replacements: { room }, type: QueryTypes.SELECT }
  );
  return booking;
};

const roomArentAvailable = async (begin, end) => {
  const booking = await db.query(
    `SELECT "idRoom"
    FROM "Booking"
    WHERE tstzrange("beginAt", "endAt")
    && ('[${begin}, ${end})'::tstzrange)`
  );
  return booking;
};

const getBookings = async (idRole = "", idUser = "") => {
  // let resUser = idRole === 1 ? {} : { Creator: idUser };

  let allBookings = await Booking.findAll({
    attributes: [
      "idBooking",
      "subject",
      "description",
      "beginAt",
      "endAt",
      "isCancled",
    ],
    include: [Room, User],
  });
  return allBookings;
};

module.exports = {
  checkForBookingAvailability,
  getBookings,
  roomArentAvailable,
};
