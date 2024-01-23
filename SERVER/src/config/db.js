const Sequelize = require("sequelize");
const db = new Sequelize("BookingApp", "postgres", "justForWork", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = db;
