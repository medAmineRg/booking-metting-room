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
  let condition = idRole !== 1 ? { Creator: { [Op.eq]: idUser } } : {};
  let allBookings = await Booking.findAll({
    where: condition,
    attributes: [
      "idBooking",
      "subject",
      "description",
      "beginAt",
      "endAt",
      "isCancled",
      "Creator",
    ],
    include: [
      { model: Room, attributes: ["nameRoom"] },
      { model: User, attributes: ["fullName"] },
    ],
  });
  return allBookings;
};

const getBookingsByName = async (title, idUser, idRole) => {
  let condition = idRole !== 1 ? { Creator: { [Op.eq]: idUser } } : {};
  condition.subject = { [Op.like]: !(title === "all") ? `%${title}%` : "%" };
  console.log(condition);
  let allBookings = await Booking.findAll({
    where: condition,
    attributes: [
      "idBooking",
      "subject",
      "description",
      "beginAt",
      "endAt",
      "isCancled",
      "Creator",
    ],
    include: [
      { model: Room, attributes: ["nameRoom"] },
      { model: User, attributes: ["fullName"] },
    ],
  });
  return allBookings;
};

module.exports = {
  checkForBookingAvailability,
  getBookings,
  roomArentAvailable,
  getBookingsByName,
};
