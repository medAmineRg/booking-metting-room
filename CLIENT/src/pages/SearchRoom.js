import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableRooms, reset } from "../features/room/roomSlice";
import { setHours, setMinutes } from "date-fns";
import Modal from "../compenents/UI/Modal";
import { createBookings } from "../features/booking/bookSlice";
import DatePicker from "../compenents/UI/DatePicker";
import { toast } from "react-toastify";

const SearchRoom = () => {
  const { rooms } = useSelector((state) => state.rooms);
  const dispatch = useDispatch();

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
    );
  };
  let exlaudeTime = [];
  let exlaudeHours;
  if (start) {
    exlaudeHours = start.getHours();
    for (let i = 1; i < 12; i++) {
      if (exlaudeHours > 8) {
        exlaudeTime.push(
          setHours(setMinutes(new Date(), 30), exlaudeHours),
          setHours(setMinutes(new Date(), 0), exlaudeHours)
        );
        exlaudeHours--;
      } else {
        break;
      }
    }
  }

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
            {rooms.map((room) => {
              return (
                <>
                  <tr key={room.idRoom}>
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
                          onChange={(e) => setSubject(e.target.value)}
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
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </Modal>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
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
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(getAvailableRooms({ start, end, capacity }))
                .unwrap()
                .then((res) => toast.success(res.message))
                .catch((e) => toast.error(e));
            }}
          >
            <div className="form-group">
              <DatePicker
                selected={start}
                onChange={(date) => {
                  setStartDate(date);
                }}
                placeholder="Select Start"
                exlaudeTime={exlaudeTime}
              />
            </div>
            <div className="form-group">
              <DatePicker
                selected={end}
                onChange={(date) => setEndDate(date)}
                exlaudeTime={exlaudeTime}
                placeholder="Select End"
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                className="form-control"
                name="capacity"
                placeholder="Enter Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
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
