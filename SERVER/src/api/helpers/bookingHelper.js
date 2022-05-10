const checkDate = (start, end) => {
  let today = new Date();
  start = new Date(start);
  end = new Date(end);
  if (today > start || start > end) {
    return "Enter a valid Time";
  }

  if (start.getHours() < 8 || start.getHours() > 18) {
    return "Time must be between 8am and 6pm";
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
