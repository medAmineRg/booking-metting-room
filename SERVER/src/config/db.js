const Sequelize = require("sequelize");
const db = new Sequelize("BookingApp", "postgres", "justForLearn", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = db;
