import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  bookingsByName,
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
import Spinner from "../compenents/UI/Spinner";
import useAuth from "../hooks/has-auth";
const Booking = () => {
  const { bookings, isLoading } = useSelector((state) => state.book);
  const { rooms } = useSelector((state) => state.rooms);
  const user = JSON.parse(localStorage.getItem("user"));
  // const [allMenus] = useState(JSON.parse(localStorage.getItem("whereAt")));
  const { currentMenu } = useSelector((state) => state.menus);

  const { showAddBtn, showEditBtn, showDeleteBtn } = useAuth(currentMenu);

  const [start, setStartDate] = useState();
  const [end, setEndDate] = useState();
  const [booking, setBooking] = useState({});

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [search, setSearch] = useState("");

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
    let updatedBooking = { id, ...booking };
    if (start) updatedBooking.beginAt = start;
    if (end) updatedBooking.endAt = end;

    dispatch(updateBooking(updatedBooking))
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

  let excludeTime = [];
  let exlaudeHours;
  if (start) {
    exlaudeHours = start.getHours();
    for (let i = 1; i < 12; i++) {
      if (exlaudeHours > 8) {
        excludeTime.push(
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
  if (isLoading) return <Spinner />;
  return (
    <div className="container">
      {open && (
        <Modal
          open={open}
          onClose={() => {
            setBooking("");
            setStartDate("");
            setEndDate("");
            setId(null);
            setOpen(false);
          }}
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
                      defaultValue={book.Room.nameRoom}
                    >
                      <option disabled>{book.Room.nameRoom}</option>
                      {rooms.map((room) => {
                        return (
                          <option
                            // defaultValue={
                            //   book.Room.nameRoom === room.nameRoom &&
                            //   room.nameRoom
                            // }
                            key={room.idRoom}
                            value={room.idRoom}
                          >
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
                      excludeTime={excludeTime}
                    />
                  </div>
                  <div className="form-group">
                    <DatePicker
                      selected={end}
                      onChange={(date) => setEndDate(date)}
                      placeholder={new Date(book.endAt).toLocaleString("fr-FR")}
                      excludeTime={excludeTime}
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
                defaultValue={booking.idRoom}
              >
                <option>Select Room</option>
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
                defaultValue={booking.subject}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="description"
                name="description"
                defaultValue={booking.description}
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
                excludeTime={excludeTime}
              />
            </div>

            <div className="form-group">
              <DatePicker
                selected={end}
                onChange={(date) => setEndDate(date)}
                excludeTime={excludeTime}
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
        <div className="filter search">
          <div style={{ flexBasis: "50%" }}>
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

          <div className="form-group" style={{ flexBasis: "40%" }}>
            <input
              name="user"
              placeholder="search for a booking by Title"
              type="text"
              className="form-control"
              onChange={(e) => setSearch(e.target.value)}
              defaultValue={search}
            />
          </div>
          <div className="form-group" style={{ marginTop: "0.5rem" }}>
            <button
              type="submit"
              className="btn btn-reverse"
              onClick={() => {
                dispatch(bookingsByName(search.length === 0 ? "all" : search))
                  .unwrap()
                  .then((res) => toast.success(res.message))
                  .catch((e) => toast.error(e));
              }}
            >
              Search
            </button>
          </div>
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
                    {(showEditBtn || user.user.idUser === book.Creator) && (
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
