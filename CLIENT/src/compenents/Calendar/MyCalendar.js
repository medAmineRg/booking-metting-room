import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createBookings,
  getBookings,
  getBookingsByRoomUser,
  reset as resetBooking,
} from "../../features/booking/bookSlice";
import Spinner from "../UI/Spinner";
import {
  reset as resetRooms,
  getRooms,
  getAvailableRooms,
} from "../../features/room/roomSlice";
import { getUsers, reset as resetUsers } from "../../features/user/userSlice";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { getMonth } from "date-fns";

import startOfWeek from "date-fns/startOfWeek";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../UI/Modal";
import { enUS } from "date-fns/locale";
import { toast } from "react-toastify";
import useAuth from "../../hooks/has-auth";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  getMonth,
  locales,
});

const MyCalendar = () => {
  const { user } = useSelector(state => state.auth);
  const { bookings, isLoading } = useSelector(state => state.book);
  const { users } = useSelector(state => state.users);
  const { rooms } = useSelector(state => state.rooms);

  const { currentMenu } = useSelector(state => state.menus);
  const { showAddBtn } = useAuth(currentMenu);
  let min = new Date();
  min.setHours(8);
  min.setMinutes(0);
  let max = new Date();
  max.setHours(18);
  max.setMinutes(0);
  const { defaultDate } = useMemo(() => {
    return {
      defaultDate: new Date(),
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const events = [];

  if (bookings && bookings.length) {
    for (let i = 0; i < bookings.length; i++) {
      let newEvent;
      if (bookings[i].isCancled) {
        newEvent = {
          id: bookings[i].idBooking,
          title: bookings[i].subject,
          start: new Date(bookings[i].beginAt),
          end: new Date(bookings[i].endAt),
          isCancled: true,
        };
      } else {
        newEvent = {
          id: bookings[i].idBooking,
          title: bookings[i].subject,
          start: new Date(bookings[i].beginAt),
          end: new Date(bookings[i].endAt),
        };
      }

      events.push(newEvent);
    }
  }

  const createBooking = () => {
    const { start, end, subject, idRoom, description } = bookInfo;
    dispatch(
      createBookings({
        beginAt: start,
        endAt: end,
        subject,
        idRoom,
        description,
      })
    )
      .unwrap()
      .then(res => {
        toast.success(res.message);
        dispatch(getBookings());
        setShow(false);
        setBookInfo({});
      })
      .catch(e => {
        toast.error(e);
      });
  };

  const [show, setShow] = useState(false);
  const [bookInfo, setBookInfo] = useState({
    start: "",
    end: "",
    subject: "",
    idRoom: "",
    description: "",
  });
  const [roomUser, setRoomUser] = useState({ idRoom: "", idUser: "" });

  const filter = e => {
    setRoomUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onClick = () => {
    dispatch(getBookingsByRoomUser(roomUser));
  };

  const handleSelect = ({ start, end }) => {
    setBookInfo({ ...bookInfo, start, end });
    dispatch(getAvailableRooms({ start, end }))
      .unwrap()
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        toast.error(e);
        setShow(false);
      });
    setShow(true);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    dispatch(getBookings());
    if (showAddBtn) {
      dispatch(getUsers());
      dispatch(getRooms());
    }

    return function cleanup() {
      dispatch(resetBooking());
      dispatch(resetRooms());
      dispatch(resetUsers());
    };
  }, [user, navigate, dispatch, showAddBtn]);
  if (isLoading) return <Spinner />;
  return (
    <div className="container">
      {showAddBtn && (
        <section className="filter">
          <div className="form-group" style={{ flexBasis: "40%" }}>
            <h4>Choose a Room</h4>
            <select
              defaultValue={roomUser.idRoom}
              className="form-control"
              name="idRoom"
              onChange={filter}
            >
              <option value="none">All</option>

              {rooms.map(room => {
                return (
                  <option key={room.idRoom} value={room.idRoom}>
                    {room.nameRoom}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group" style={{ flexBasis: "40%" }}>
            <h4>Choose a User</h4>
            <select
              defaultValue={roomUser.idUser}
              name="idUser"
              className="form-control"
              onChange={filter}
            >
              <option value="none">All</option>

              {users.map(user => {
                return (
                  <option key={user.idUser} value={user.idUser}>
                    {user.fullName}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className="form-group"
            style={{ alignSelf: "center", marginTop: "0.4rem" }}
          >
            <button type="submit" className="btn btn-reverse" onClick={onClick}>
              Filter
            </button>
          </div>
        </section>
      )}
      {show && (
        <Modal
          submit={"Book"}
          open={show}
          onClose={() => {
            setShow(false);
            dispatch(getRooms());
          }}
          post={createBooking}
        >
          <div className="form-group">
            <label>Start</label>
            <input
              className="form-control"
              value={bookInfo.start}
              disabled
              name="start"
            />
          </div>
          <div className="form-group">
            <label>End</label>
            <input
              disabled
              value={bookInfo.end}
              className="form-control"
              placeholder="End"
              name="end"
            />
          </div>
          <div className="form-group">
            <select
              className="form-control"
              name="idRoom"
              defaultValue={bookInfo.idRoom}
              onChange={e => {
                setBookInfo({ ...bookInfo, [e.target.name]: e.target.value });
              }}
            >
              <option>Choose a room</option>
              {rooms.map(room => {
                return (
                  <option key={room.idRoom} value={room.idRoom}>
                    {room.nameRoom}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              className="form-control"
              placeholder="Subject"
              name="subject"
              onChange={e =>
                setBookInfo({ ...bookInfo, [e.target.name]: e.target.value })
              }
              value={bookInfo.subject}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="description"
              name="description"
              onChange={e =>
                setBookInfo({ ...bookInfo, [e.target.name]: e.target.value })
              }
              value={bookInfo.description}
            />
          </div>
        </Modal>
      )}
      <div>
        <Calendar
          style={{ height: 500 }}
          defaultDate={defaultDate}
          selectable={showAddBtn}
          defaultView="day"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelect}
          // onSelectEvent={(event) => alert(event.title)}
          min={min}
          max={max}
          eventPropGetter={(event, start, end, isSelected) => {
            console.log(event);
            let newStyle = {};

            if (event.isCancled) {
              newStyle.backgroundColor = "#FEC43C";
              newStyle.border = "1px solid #FEC43C";
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;
