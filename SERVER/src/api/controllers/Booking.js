const { checkDate, generateDateTime } = require("../helpers/bookingHelper");
const Booking = require("../models/Booking");
const { Op } = require("sequelize");

const {
  checkForBookingAvailability,
  getBookings,
} = require("../services/bookingEntity.js");
const { filterCheck } = require("../helpers/userHelper");

const getAllbookings = async (req, res) => {
  try {
    const allBookings = await getBookings(req.user.idRole, req.user.idUser);
    return res.status(200).send(allBookings);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Can't get bookings",
      code: 400,
      api: "/bookings/all",
      method: "GET",
    });
  }
};

const getAllbookingsForOneUser = async (req, res) => {
  try {
    const allBookingsForOneUser = await Booking.findAll({
      where: {
        Creator: req.user.idUser,
      },
      attributes: [
        "idBooking",
        "subject",
        "description",
        "beginAt",
        "endAt",
        "isCancled",
        "Creator",
      ],
      raw: true,
    });

    return res.status(200).send(allBookingsForOneUser);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't get bookings",
      code: 400,
      api: "/bookings",
      method: "GET",
    });
  }
};

const getBookingByIdRoomUser = async (req, res) => {
  const { idRoom, idUser } = req.params;
  const result = filterCheck(idUser, idRoom);
  let obj = {};
  if (result) {
    obj = {
      where: result,
    };
  }
  try {
    const bookByUserRoom = await Booking.findAll(result && obj);
    return res.status(200).send(bookByUserRoom);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      api: "/bookings/idroom/iduser",
      message: "Can't filter booking",
      status: "Error",
      code: 400,
      method: "GET",
    });
  }
};

const addBooking = async (req, res) => {
  const idUser = req.user.idUser;
  const { idRoom, subject, description, beginAt, endAt } = req.body;
  if (!idRoom) {
    return res.status(400).json({
      api: "/bookings",
      code: 400,
      message: "You have to provide the room!",
      status: "Error",
      method: "POST",
    });
  }
  const dateIsntValid = checkDate(beginAt, endAt);
  if (dateIsntValid)
    return res.status(400).json({
      api: "/bookings",
      code: 400,
      message: dateIsntValid,
      status: "Error",
      method: "POST",
    });

  const bookingAv = await checkForBookingAvailability(beginAt, endAt, idRoom);
  if (bookingAv[0])
    return res.status(400).json({
      message:
        "Alreday has a booking in that room at this time! please select another time.",
      code: 400,
      status: "Error",
      api: "/bookings",
      method: "POST",
    });

  try {
    const booking = await Booking.create({
      Creator: idUser,
      idRoom,
      subject,
      description,
      beginAt,
      endAt,
    });
    return res.status(201).json({
      status: "Created",
      code: 201,
      method: "POST",
      api: "/bookings",
      message: "Your reservation has made succefully",
      booking,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.errors[0].message || "Can't create booking",
      status: "Error",
      code: 400,
      method: "POST",
      api: "/bookings",
    });
  }
};

const updateBooking = async (req, res) => {
  const now = generateDateTime(2);
  const { idRoom, beginAt, endAt } = req.body;
  if (beginAt && endAt) {
    const dateIsntValid = checkDate(beginAt, endAt);
    if (dateIsntValid)
      return res.status(400).json({
        message: dateIsntValid,
        api: "/bookings",
        code: 400,
        status: "Error",
        method: "PATCH",
      });

    if (idRoom) {
      const bookingAv = await checkForBookingAvailability(
        beginAt,
        endAt,
        idRoom,
        req.params.id
      );

      if (bookingAv[0] && bookingAv[0].idBooking !== req.params.id)
        return res.status(400).json({
          api: "/bookings",
          code: 400,
          status: "Error",
          method: "PATCH",
          message:
            "Alreday has a booking in that room at this time! please select another time.",
        });
    }
  }

  try {
    const resUpdate = await Booking.update(
      { ...req.body, updatedBy: req.user.idUser },
      {
        where: {
          beginAt: {
            [Op.gt]: new Date(now),
          },
          idBooking: req.params.id,
        },
      }
    );
    if (resUpdate[0]) {
      return res.status(200).json({
        status: "Updated",
        api: "/bookings",
        method: "PATCH",
        code: 200,
        message: "Booking was updated.",
      });
    }

    return res.status(401).json({
      api: "/bookings",
      code: 400,
      status: "Error",
      method: "PATCH",
      message:
        "You can only update the booking before 2 hours from the starting time",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: "400",
      message: "Can't update booking",
      status: "Error",
      method: "PATCH",
      api: "/bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    await Booking.update(
      { isCancled: true },
      {
        where: {
          idBooking: req.params.id,
        },
      }
    );
    res.status(200).json({
      status: "Ok",
      code: 200,
      message: "Cancled sucefully.",
      api: "/bookings/:id/cancel",
      method: "PATCH",
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.errors[0].message || "Can't Cancel booking",
      status: "Error",
      method: "PATCH",
      api: "/bookings",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    let destroyedBooking = await Booking.destroy({
      where: {
        idBooking: req.params.id,
      },
    });
    if (!destroyedBooking) {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "No Bookings was found to be deleted.",
        method: "DELETE",
        api: "/bookings",
      });
    }

    return res.status(200).json({
      status: "OK",
      code: 200,
      api: "/bookings/id",
      method: "DELETE",
      message: "The Booking has been deleted succefully.",
      idBooking: Number(req.params.id),
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't delete booking",
      code: 400,
      api: "/bookings/id",
      method: "DELETE",
    });
  }
};

module.exports = {
  getAllbookingsForOneUser,
  addBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getAllbookings,
  getBookingByIdRoomUser,
};
