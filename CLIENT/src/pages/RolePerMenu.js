import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { getMenus } from "../features/menu/menuSlice";
import { getPermissions } from "../features/permission/permissionSlice";
import { getRoles } from "../features/role/roleSlice";
import { AiOutlineDelete } from "react-icons/ai";
import {
  deleteRolePerMenu,
  getRolePerMenu,
  postRolePerMenu,
  reset,
} from "../features/RolePerMenu/rolePerMenuSlice";
import Spinner from "../compenents/UI/Spinner";
import useAuth from "../hooks/has-auth";

const RolePerMenu = () => {
  const { rolePerMenu, isLoading } = useSelector((state) => state.rolePerMenu);
  const { role: roles } = useSelector((state) => state.role);
  const { menus } = useSelector((state) => state.menus);
  const { permission } = useSelector((state) => state.per);

  const { currentMenu } = useSelector((state) => state.menus);

  const { showAddBtn, showDeleteBtn } = useAuth(currentMenu);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [newRolePerMenu, setNewRolePerMenu] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // add user

  const addARolePerMenu = async () => {
    dispatch(postRolePerMenu(newRolePerMenu))
      .unwrap()
      .then((res) => {
        dispatch(getRolePerMenu());
        toast.success(res.message);
        setAdd(false);
        setNewRolePerMenu({});
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteFun = () => {
    dispatch(
      deleteRolePerMenu({
        idMenu: rolePerMenu[id].Menu.idMenu,
        idRole: rolePerMenu[id].Role.idRole,
        idPer: rolePerMenu[id].Permission.idPer,
      })
    )
      .unwrap()
      .then((res) => {
        dispatch(getRolePerMenu());
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
    setNewRolePerMenu((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    dispatch(getRolePerMenu());
    dispatch(getRoles());
    dispatch(getPermissions());
    dispatch(getMenus());

    return function cleanup() {
      dispatch(reset());
    };
  }, [navigate, dispatch]);
  if (isLoading) return <Spinner />;

  return (
    <div className="container">
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} submit={"Submit"}>
          {/* {rolePerMenu.map((item) => {
            if (item.idUser === id) {
              return (
                <section className="from" key={item.idUser}>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      className="form-control"
                      defaultValue={item.nameRole}
                      name="nameRole"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Permission</label>
                    <input
                      className="form-control"
                      defaultValue={item.namePer}
                      name="fullName"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Menu</label>
                    <input
                      className="form-control"
                      defaultValue={item.nameMenu}
                      name="nameMenu"
                      onChange={onChange}
                    />
                  </div>
                </section>
              );
            } else {
              return null;
            }
          })} */}
        </Modal>
      )}
      {add && (
        <Modal
          open={add}
          onClose={() => {
            setAdd(false);
          }}
          submit={"Submit"}
          post={addARolePerMenu}
        >
          <section className="from">
            <div className="form-group">
              <select
                name="idRole"
                onChange={onChange}
                value={newRolePerMenu.idRole}
              >
                <option value={0}>Choose a Role</option>
                {roles.map((role) => {
                  return (
                    <option key={role.idRole} value={role.idRole}>
                      {role.nameRole}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <select
                name="idPer"
                onChange={onChange}
                value={newRolePerMenu.idPer}
              >
                <option disabled value={0}>
                  Choose a Permission
                </option>
                {permission.map((per) => {
                  return (
                    <option key={per.idPer} value={per.idPer}>
                      {per.namePer}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <select
                name="idMenu"
                onChange={onChange}
                value={newRolePerMenu.idMenu}
              >
                <option disabled value={0}>
                  Choose a Menu
                </option>
                {menus.map((menu) => {
                  return (
                    <option key={menu.idMenu} value={menu.idMenu}>
                      {menu.nameMenu}
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
            Add a permission to a role in a menu
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>Role</th>
            <th>Permission</th>
            <th>Menu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rolePerMenu.slice(indexOfFirst, indexOfLast).map((item, i) => {
            return (
              <tr key={i}>
                <td></td>
                <td>{item.Role ? item.Role.nameRole : "refresh"}</td>
                <td>{item.Permission ? item.Permission.namePer : "refresh"}</td>
                <td>{item.Menu ? item.Menu.nameMenu : "refresh"}</td>
                <td>
                  {showDeleteBtn && (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setId(i - 5 + indexOfLast);
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
        totalPosts={rolePerMenu.length}
        paginate={paginate}
      />
    </div>
  );
};

export default RolePerMenu;
