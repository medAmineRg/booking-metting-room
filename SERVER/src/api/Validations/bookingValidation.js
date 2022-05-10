const yup = require("yup");

const bookingSchema = yup.object({
  idRoom: yup.string(36).required(),
  subject: yup.string().min(5).required(),
  description: yup.string().min(15).max(250).required(),
  beginAt: yup.date().required(),
  endAt: yup.date().required(),
});

const bookingUpdateSchema = yup.object({
  idRoom: yup.number(),
  subject: yup.string().min(5).max(250),
  description: yup.string().min(15).max(250),
  beginAt: yup.date(),
  endAt: yup.date(),
});

module.exports = { bookingSchema, bookingUpdateSchema };
