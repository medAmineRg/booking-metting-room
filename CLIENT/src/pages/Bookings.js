import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  createBookings,
  deleteBookings,
  getBookings,
  reset as resetBooking,
  updateBooking,
} from "../features/booking/bookSlice";
import { setHours, setMinutes } from "date-fns";
import { getRooms, reset as resetRoom } from "../features/room/roomSlice";
import { toast } from "react-toastify";
import DatePicker from "../compenents/UI/DatePicker";

const Booking = () => {
  const { bookings } = useSelector((state) => state.book);
  const { rooms } = useSelector((state) => state.rooms);

  const menu = JSON.parse(localStorage.getItem("whereAt"));
  const user = JSON.parse(localStorage.getItem("user"));

  let showEditBtn = false;
  let showDeleteBtn = false;
  let showAddBtn = false;

  const hasAuth = (menus = menu) => {
    const per = menu.Permission;
    for (let i = 0; i < per.length; i++) {
      if (per[i].namePer === "WRITE" || per[i].namePer === "Garant All") {
        showAddBtn = true;
      }
      if (per[i].namePer === "UPDATE" || per[i].namePer === "Garant All") {
        showEditBtn = true;
      }
      if (per[i].namePer === "DELETE" || per[i].namePer === "Garant All") {
        showDeleteBtn = true;
      }
    }
  };
  hasAuth();

  const [start, setStartDate] = useState();
  const [end, setEndDate] = useState();
  const [booking, setBooking] = useState({});

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const dispatch = useDispatch();
  const onChange = (e) => {
    setBooking((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const createBooking = () => {
    dispatch(createBookings({ beginAt: start, endAt: end, ...booking }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getBookings());
        setBooking("");
        setStartDate("");
        setEndDate("");
        setAdd(false);
      })
      .catch((e) => {
        toast.error(e);
      });
  };
  const update = () => {
    dispatch(updateBooking({ id, beginAt: start, endAt: end, ...booking }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getBookings());
        setBooking("");
        setStartDate("");
        setEndDate("");
        setId(null);
        setOpen(false);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteFun = () => {
    dispatch(deleteBookings(id))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAsk(false);
        setId(null);
      })
      .catch((e) => toast.error(e));
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
  useEffect(() => {
    dispatch(getBookings());
    dispatch(getRooms());

    return function cleanup() {
      dispatch(resetBooking());
      dispatch(resetRoom());
    };
  }, [dispatch]);
  return (
    <div className="container">
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          submit={"Submit"}
          post={update}
        >
          {bookings.map((book) => {
            if (book.idBooking === id) {
              return (
                <section className="from" key={1}>
                  <div className="form-group">
                    <label>User</label>
                    <input
                      className="form-control"
                      defaultValue={book.User.fullName}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control"
                      name="idRoom"
                      onChange={onChange}
                    >
                      <option disabled selected>
                        {book.Room.nameRoom}
                      </option>
                      {rooms.map((room) => {
                        return (
                          <option key={room.idRoom} value={room.idRoom}>
                            {room.nameRoom}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      className="form-control"
                      defaultValue={book.subject}
                      name="subject"
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      defaultValue={book.description}
                      name="description"
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <DatePicker
                      selected={start}
                      onChange={(date) => {
                        setStartDate(date);
                      }}
                      placeholder={new Date(book.beginAt).toLocaleString(
                        "fr-FR"
                      )}
                      exlaudeTime={exlaudeTime}
                    />
                  </div>
                  <div className="form-group">
                    <DatePicker
                      selected={end}
                      onChange={(date) => setEndDate(date)}
                      placeholder={new Date(book.endAt).toLocaleString("fr-FR")}
                      exlaudeTime={exlaudeTime}
                    />
                  </div>
                </section>
              );
            } else {
              return null;
            }
          })}
        </Modal>
      )}
      {add && (
        <Modal
          open={add}
          onClose={() => setAdd(false)}
          submit={"Submit"}
          post={createBooking}
        >
          <section className="from">
            <div className="form-group">
              <select
                className="form-control"
                name="idRoom"
                onChange={onChange}
              >
                <option value="none" defaultValue>
                  Select Room
                </option>
                {rooms.map((room) => {
                  return (
                    <option key={room.idRoom} value={room.idRoom}>
                      {room.nameRoom}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                className="form-control"
                placeholder="subject"
                name="subject"
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="description"
                name="description"
                onChange={onChange}
              />
            </div>

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
          </section>
        </Modal>
      )}
      {ask && (
        <Modal
          open={ask}
          onClose={() => setAsk(false)}
          submit={"Yes"}
          post={deleteFun}
        >
          <h3 style={{ color: "#6E6E74" }}>Are you Sure?</h3>
          <p style={{ color: "gray" }}>
            Do you really want to delete this record?
          </p>
        </Modal>
      )}
      {showAddBtn && (
        <div>
          <button
            className="btn btn-success"
            onClick={() => {
              setAdd(true);
              dispatch(getRooms());
            }}
          >
            Add a Booking
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th>Room</th>
            <th>User</th>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr key={0}>
              <td>No bookings was found</td>
            </tr>
          ) : (
            bookings.slice(indexOfFirst, indexOfLast).map((book) => {
              return (
                <tr key={book.idBooking}>
                  <td></td>
                  <td>{book.idBooking}</td>
                  <td>{book.Room ? book.Room.nameRoom : "Deleted"}</td>
                  <td>{book.User ? book.User.fullName : "Deleted"}</td>
                  <td>{book.subject}</td>
                  <td>{new Date(book.beginAt).toLocaleString("fr-FR")}</td>
                  <td>{new Date(book.endAt).toLocaleString("fr-FR")}</td>
                  <td>{book.description.substr(0, 15) + "..."}</td>
                  <td>
                    {(showEditBtn || user.user.idUser === book.User.idUser) && (
                      <button
                        onClick={() => {
                          setId(book.idBooking);
                          setOpen(true);
                        }}
                        className="btn btn-warning"
                        style={{ marginBottom: "5px" }}
                      >
                        <BiEdit />
                      </button>
                    )}
                    {showDeleteBtn && (
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setId(book.idBooking);
                          setAsk(true);
                        }}
                      >
                        <AiOutlineDelete />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={bookings.length}
        paginate={paginate}
      />
    </div>
  );
};

export default Booking;
