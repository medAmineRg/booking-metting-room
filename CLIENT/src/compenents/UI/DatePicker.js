import {
  addMinutes,
  setHours,
  setMinutes,
  subDays,
  addDays,
  differenceInDays,
} from "date-fns";
import ReactDatePicker from "react-datepicker";

const DatePicker = ({
  selected,
  onChange,
  placeholder,
  start,
  excludeTime,
}) => {
  if (start) excludeTime.push(start);

  excludeTime.push(setHours(setMinutes(new Date(), 30), 18));
  const filterPassedTime = (start) => {
    const currentDate = addMinutes(new Date(), 30);
    const selectedDate = new Date(start);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const excludeTimeFun = (excludeTime, str, end) => {
    for (let i = str; i <= end; i++) {
      excludeTime.push(
        setHours(setMinutes(new Date(), 0), i),
        setHours(setMinutes(new Date(), 30), i)
      );
    }
  };
  excludeTimeFun(excludeTime, 0, 7);
  excludeTimeFun(excludeTime, 19, 23);
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      filterTime={filterPassedTime}
      dateFormat="MMMM d, yyyy h:mm aa"
      minDate={new Date()}
      timeIntervals={30}
      className="form-control"
      excludeTimes={excludeTime}
      placeholderText={placeholder}
      excludeDateIntervals={
        start && [
          {
            start: subDays(
              new Date(start),
              differenceInDays(new Date(start), new Date()) + 1
            ),
            end: addDays(new Date(start), -1),
          },
        ]
      }
    />
  );
};

export default DatePicker;
