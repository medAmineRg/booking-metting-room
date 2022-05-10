import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { getRoles, reset as resetRole } from "../features/role/roleSlice";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineCheckSquare } from "react-icons/ai";
import {
  activeUser,
  createUser,
  deleteUser,
  getUsers,
  reset as resetUser,
  updateUser,
} from "../features/user/userSlice";
import { userSchemaLog } from "../Validation/UserValidation";

const User = () => {
  const { users } = useSelector((state) => state.users);
  const { role: roles } = useSelector((state) => state.role);

  const allMenus = JSON.parse(localStorage.getItem("whereAt"));
  let showEditBtn = false;
  let showDeleteBtn = false;
  let showAddBtn = false;

  const hasAuth = (menu = allMenus) => {
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

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [newUser, setNewUser] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // add user
  const addUser = async () => {
    if (!newUser.idRole) {
      toast.error("Please select a role !");
      return;
    }
    try {
      await userSchemaLog.validate(newUser);
      dispatch(createUser(newUser))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setAdd(false);
          setNewUser({});
        })
        .catch((e) => toast.error(e));
    } catch (error) {
      return toast.error(error.errors[0]);
    }
  };

  const updateAUser = () => {
    dispatch(updateUser({ id, ...newUser }))
      .unwrap()
      .then((res) => {
        dispatch(getUsers());
        setOpen(false);
        toast.success(res.message);
        setId(null);
        setNewUser({});
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteFun = () => {
    dispatch(deleteUser(id))
      .unwrap()
      .then((res) => {
        setAsk(false);
        toast.success(res.message);
        setId(null);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setNewUser((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRoles());
    return function cleanup() {
      dispatch(resetUser());
      dispatch(resetRole());
    };
  }, [navigate, dispatch]);

  return (
    <div className="container">
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          submit={"Submit"}
          post={updateAUser}
        >
          {users.map((user) => {
            if (user.idUser === id) {
              return (
                <section className="from" key={user.idUser}>
                  <div className="form-group">
                    <label>Email User</label>
                    <input
                      className="form-control"
                      defaultValue={user.email}
                      name="email"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fullname</label>
                    <input
                      className="form-control"
                      defaultValue={user.fullName}
                      name="fullName"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>password</label>
                    <input
                      className="form-control"
                      name="password"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      className="form-control"
                      defaultValue={user.phone}
                      name="phone"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="idRole" onChange={onChange}>
                      <option disabled selected defaultValue>
                        {user.Role.nameRole}
                      </option>
                      {roles.map((role) => {
                        return (
                          <option key={role.idRole} value={role.idRole}>
                            {role.nameRole}
                          </option>
                        );
                      })}
                    </select>
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
          onClose={() => {
            setAdd(false);
          }}
          submit={"Submit"}
          post={addUser}
        >
          <section className="from">
            <div className="form-group">
              <label>Email User</label>
              <input
                className="form-control"
                placeholder="Email"
                name="email"
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Fullname</label>
              <input
                className="form-control"
                placeholder="Fullname"
                name="fullName"
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>password</label>
              <input
                className="form-control"
                placeholder="password"
                name="password"
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                placeholder="Phone"
                name="phone"
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="idRole" onChange={onChange}>
                <option disabled="disabled" defaultValue>
                  Choose a Role
                </option>
                {roles.map((role) => {
                  return (
                    <option key={role.idRole} value={role.idRole}>
                      {role.nameRole}
                    </option>
                  );
                })}
              </select>
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
            }}
          >
            Add a User
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(indexOfFirst, indexOfLast).map((user) => {
            return (
              <tr key={user.idUser}>
                <td></td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone ? user.phone : "Not Provided"}</td>
                <td>{user.Role ? user.Role.nameRole : "Refresh"}</td>
                <td>
                  {showEditBtn && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setId(user.idUser);
                        setOpen(true);
                      }}
                    >
                      <BiEdit />
                    </button>
                  )}
                  {!user.activation && (
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        dispatch(activeUser(user.idUser))
                          .unwrap()
                          .then((res) => {
                            dispatch(getUsers());
                            toast.success(res.message);
                          })
                          .catch((e) => {
                            toast.error(e);
                          })
                      }
                    >
                      <AiOutlineCheckSquare />
                    </button>
                  )}
                  {showDeleteBtn && (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setId(user.idUser);
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
        totalPosts={users.length}
        paginate={paginate}
      />
    </div>
  );
};

export default User;
