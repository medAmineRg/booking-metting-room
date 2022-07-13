import { useState } from "react";
import classes from "./DigDate.module.css";
function DigDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date();
  const [dateTime, setDateTime] = useState({
    month: date.getMonth(),
    day: date.getDay(),
    date: date.getDate(),
    year: date.getFullYear(),
    hour: date.getHours(),
    min: date.getMinutes(),
  });
  setInterval(() => {
    const date = new Date();

    setDateTime({
      month: date.getMonth(),
      day: date.getDay(),
      date: date.getDate(),
      year: date.getFullYear(),
      hour: date.getHours(),
      min: date.getMinutes(),
    });
  }, 10000);
  let pe = "AM";
  if (dateTime.hour >= 12) {
    pe = "PM";
  }

  return (
    <div className={classes.body}>
      <div className={classes.datetime}>
        <div className={classes.date}>
          <span>{week[dateTime.day]}</span>,
          <span>{months[dateTime.month]}</span>
          <span>{dateTime.date}</span>,<span>{dateTime.year}</span>
        </div>
        <div className={classes.time}>
          <span>{dateTime.hour}</span>:<span>{dateTime.min}</span>
          <span>{pe}</span>
        </div>
      </div>
    </div>
  );
}

export default DigDate;
