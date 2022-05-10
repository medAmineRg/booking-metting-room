import { addMinutes, setHours, setMinutes } from "date-fns";
import ReactDatePicker from "react-datepicker";

const DatePicker = ({ selected, onChange, placeholder, exlaudeTime }) => {
  exlaudeTime.push(setHours(setMinutes(new Date(), 30), 18));
  const filterPassedTime = (time) => {
    const currentDate = addMinutes(new Date(), 30);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const excludeTimeFun = (exlaudeTime, start, end) => {
    for (let i = start; i <= end; i++) {
      exlaudeTime.push(
        setHours(setMinutes(new Date(), 0), i),
        setHours(setMinutes(new Date(), 30), i)
      );
    }
  };
  excludeTimeFun(exlaudeTime, 0, 7);
  excludeTimeFun(exlaudeTime, 19, 23);

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
      excludeTimes={exlaudeTime}
      placeholderText={placeholder}
    />
  );
};

export default DatePicker;
