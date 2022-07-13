const { addMinutes, getDay } = require("date-fns");
const checkDate = (start, end) => {
  let today = new Date();
  start = new Date(start);
  end = new Date(end);
  if (today > start || start >= end) {
    return "Enter a valid Time";
  }

  const startDay = getDay(start);
  const endDay = getDay(end);

  if (!(startDay !== 0 && startDay !== 6) || !(endDay !== 0 && endDay !== 6)) {
    return "You cant reserve a room in weekend !";
  }

  if (
    start.getHours() < 8 ||
    start.getHours() > 18 ||
    end.getHours() < 8 ||
    end.getHours() > 18
  ) {
    return "Time must be between 8am and 6pm";
  }

  if (addMinutes(today, 29) > start) {
    return "You must book before 30 minutes from the beginning of the booking";
  }
};

const generateDateTime = (plusHour = 0) => {
  const date = new Date();
  const hour = date.getHours();
  date.setHours(hour + plusHour);
  let now = date.toISOString();
  return now;
};

module.exports = {
  checkDate,
  generateDateTime,
};
