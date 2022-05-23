import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom as update,
  reset,
  getRoomByName,
} from "../features/room/roomSlice";
import Spinner from "../compenents/UI/Spinner";
import Pagination from "../compenents/UI/Pagination";
import useAuth from "../hooks/has-auth";
const Room = () => {
  const { rooms, isLoading } = useSelector((state) => state.rooms);

  const { currentMenu } = useSelector((state) => state.menus);
  const { showAddBtn, showEditBtn, showDeleteBtn } = useAuth(currentMenu);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [room, setRoom] = useState({});
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addRoom = () => {
    dispatch(createRoom(room))
      .unwrap()
      .then((res) => {
        dispatch(getRooms());
        setAdd(false);
        toast.success(res.message);
        setRoom({});
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const updateRoom = () => {
    dispatch(update({ id, ...room }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getRooms());
        setOpen(false);
        setRoom({});
        setId(null);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteFun = () => {
    dispatch(deleteRoom(id))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAsk(false);
        setId(null);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const onChange = (e) => {
    setRoom((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    dispatch(getRooms());
    return function cleanup() {
      dispatch(reset());
    };
  }, [dispatch]);
  if (isLoading) return <Spinner />;

  return (
    <div className="container">
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          submit={"Submit"}
          post={updateRoom}
        >
          {rooms.map((room) => {
            if (room.idRoom === id) {
              return (
                <section className="from" key={room.idRoom}>
                  <div className="form-group">
                    <label>Room Name</label>
                    <input
                      className="form-control"
                      defaultValue={room.nameRoom}
                      name="nameRoom"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type Room</label>
                    <input
                      className="form-control"
                      defaultValue={room.typeRoom}
                      name="typeRoom"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      className="form-control"
                      defaultValue={room.capacity}
                      name="capacity"
                      onChange={onChange}
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
          post={addRoom}
          open={add}
          onClose={() => setAdd(false)}
          submit={"Submit"}
        >
          <section className="from">
            <div className="form-group">
              <label>Room Name</label>
              <input
                className="form-control"
                placeholder="Room Name"
                name="nameRoom"
                onChange={onChange}
                defaultValue={room.nameRoom}
              />
            </div>
            <div className="form-group">
              <label>Type Room</label>
              <input
                className="form-control"
                placeholder="Type Room"
                name="typeRoom"
                onChange={onChange}
                defaultValue={room.typeRoom}
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                className="form-control"
                placeholder="Capacity"
                name="capacity"
                onChange={onChange}
                defaultValue={room.capacity}
              />
            </div>
          </section>
        </Modal>
      )}
      {ask && (
        <Modal
          open={true}
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

      <div className="filter search">
        {showAddBtn && (
          <div style={{ flexBasis: "50%" }}>
            <button
              className="btn btn-success"
              onClick={() => {
                setAdd(true);
              }}
            >
              Add a Room
            </button>
          </div>
        )}
        <div className="form-group" style={{ flexBasis: "40%" }}>
          <input
            name="user"
            placeholder="search for room by name"
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
              dispatch(getRoomByName(search.length === 0 ? "all" : search))
                .unwrap()
                .then((res) => toast.success(res.message))
                .catch((e) => toast.error(e));
            }}
          >
            Search
          </button>
        </div>
      </div>

      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th>Name</th>
            <th>Type Room</th>
            <th>Capacity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.slice(indexOfFirst, indexOfLast).map((room) => {
            return (
              <tr key={room.idRoom}>
                <td></td>
                <td>{room.idRoom}</td>
                <td>{room.nameRoom}</td>
                <td>{room.typeRoom}</td>
                <td>{room.capacity}</td>
                <td>
                  {showEditBtn && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setId(room.idRoom);
                        setOpen(true);
                      }}
                    >
                      <BiEdit />
                    </button>
                  )}
                  {showDeleteBtn && (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setId(room.idRoom);
                        setAsk(true);
                      }}
                    >
                      <AiOutlineDelete />
                    </button>
                  )}
                </td>
              </tr>
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
};

export default Room;
