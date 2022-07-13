import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableRooms, reset } from "../features/room/roomSlice";
import { setHours, setMinutes, addMinutes, getDay } from "date-fns";
import Modal from "../compenents/UI/Modal";
import { createBookings } from "../features/booking/bookSlice";
import Pagination from "../compenents/UI/Pagination";
import { toast } from "react-toastify";
import Spinner from "../compenents/UI/Spinner";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchRoom = () => {
  const { rooms, isLoading } = useSelector(state => state.rooms);
  const dispatch = useDispatch();

  const filterPassedTime = start => {
    const currentDate = addMinutes(new Date(), 30);
    const selectedDate = new Date(start);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const isWeekday = date => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  useEffect(() => {
    return function cleanup() {
      dispatch(reset());
    };
  }, [dispatch]);

  const [id, setId] = useState();
  const [start, setStartDate] = useState();
  const [end, setEndDate] = useState();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [show, setShow] = useState(false);

  const createBooking = () => {
    dispatch(
      createBookings({
        beginAt: start,
        endAt: end,
        subject,
        description,
        idRoom: id,
      })
    )
      .unwrap()
      .then(res => {
        toast.success(res.message);
        setShow(false);
      })
      .catch(e => toast.error(e));
  };

  let excludeTime = [];
  let exlaudeHours;
  if (start) {
    exlaudeHours = start.getHours();
    let min = start.getMinutes();
    console.log(min);
    for (let i = 1; i < 12; i++) {
      if (i === 1) {
        excludeTime.push(start);
        if (min === 30) {
          excludeTime.push(
            setHours(setMinutes(new Date(start), 0), exlaudeHours)
          );
        }
        exlaudeHours--;
      } else if (exlaudeHours >= 8) {
        excludeTime.push(
          setHours(setMinutes(new Date(start), 0), exlaudeHours),
          setHours(setMinutes(new Date(start), 30), exlaudeHours)
        );
        exlaudeHours--;
      } else {
        break;
      }
    }
    console.log(excludeTime, new Date(start));
  }

  const excludeTimeFun = (excludeTime, str, end) => {
    for (let i = str; i <= end; i++) {
      excludeTime.push(
        setHours(setMinutes(new Date(), 0), i),
        setHours(setMinutes(new Date(), 30), i)
      );
    }
    excludeTime.push(setHours(setMinutes(new Date(), 30), 18));
  };
  excludeTimeFun(excludeTime, 0, 7);
  excludeTimeFun(excludeTime, 19, 23);
  if (isLoading) return <Spinner />;

  if (rooms.length) {
    return (
      <div className="container">
        <table className="content-table">
          <thead>
            <tr key={1}>
              <th></th>
              <th>Id</th>
              <th>Name</th>
              <th>Type Room</th>
              <th>Capacity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.slice(indexOfFirst, indexOfLast).map(room => {
              return (
                <React.Fragment key={room.idRoom}>
                  <tr>
                    <td></td>
                    <td>{room.idRoom}</td>
                    <td>{room.nameRoom}</td>
                    <td>{room.typeRoom}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <button
                        onClick={() => {
                          setShow(true);
                          setId(room.idRoom);
                        }}
                        className="btn btn-warning"
                      >
                        BOOK
                      </button>
                    </td>
                  </tr>
                  {show && (
                    <Modal
                      submit={"Book"}
                      open={true}
                      onClose={() => setShow(false)}
                      post={createBooking}
                    >
                      <div className="form-group">
                        <label>Subject</label>
                        <input
                          className="form-control"
                          placeholder="Subject"
                          name="subject"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Description"
                          name="description"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                        />
                      </div>
                    </Modal>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={rooms.length}
          paginate={paginate}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="login">
        <section className="heading">
          <h1>Search For Room</h1>
        </section>

        <section className="form">
          <form
            onSubmit={e => {
              e.preventDefault();
              dispatch(getAvailableRooms({ start, end, capacity }))
                .unwrap()
                .then(res => toast.success(res.message))
                .catch(e => toast.error(e));
            }}
          >
            <div className="form-group">
              <ReactDatePicker
                filterDate={isWeekday}
                selected={start}
                onChange={date => setStartDate(date)}
                showTimeSelect
                filterTime={filterPassedTime}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                timeIntervals={30}
                className="form-control"
                excludeTimes={excludeTime}
                placeholderText={"Select Start Date"}
              />
            </div>
            <div
              className="form-group"
              onClick={() => {
                if (!start) toast.error("select start date first");
              }}
            >
              <ReactDatePicker
                filterDate={isWeekday}
                disabled={start ? false : true}
                selected={end}
                onChange={date => setEndDate(date)}
                showTimeSelect
                filterTime={filterPassedTime}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date(start)}
                timeIntervals={30}
                className="form-control"
                excludeTimes={excludeTime}
                placeholderText={"Select End Date"}
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                className="form-control"
                name="capacity"
                placeholder="Enter Capacity"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-block">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SearchRoom;
