import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

import {
  deleteMenu,
  getMenus,
  postMenu,
  reset,
  updateMenu,
} from "../features/menu/menuSlice";
import Spinner from "../compenents/UI/Spinner";
const Menu = () => {
  const { menus, isLoading } = useSelector((state) => state.menus);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [menu, setMenu] = useState({});

  const dispatch = useDispatch();

  const createMenu = () => {
    dispatch(postMenu(menu))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAdd(false);
        setMenu({});
      })
      .catch((e) => toast.error(e));
  };

  const updateAMenu = () => {
    dispatch(updateMenu({ id, ...menu }))
      .unwrap()
      .then((res) => {
        dispatch(getMenus());
        toast.success(res.message);
        setId(null);
        setMenu({});
        setOpen(false);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteAMenu = () => {
    dispatch(deleteMenu(id))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setId(null);
      })
      .catch((e) => toast.error(e.message));
    setAsk(false);
  };

  useEffect(() => {
    dispatch(getMenus());
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
          post={updateAMenu}
          submit={"Submit"}
        >
          {menus.map((menu) => {
            if (menu.idMenu === id) {
              return (
                <section className="from" key={menu.idMenu}>
                  <div className="form-group">
                    <label>Id menu</label>
                    <input
                      className="form-control"
                      defaultValue={menu.idMenu}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Name Menu</label>
                    <input
                      className="form-control"
                      defaultValue={menu.nameMenu}
                      name="nameMenu"
                      onChange={(e) =>
                        setMenu((pre) => ({
                          ...pre,
                          [e.target.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Path Menu</label>
                    <input
                      className="form-control"
                      defaultValue={menu.Path}
                      name="Path"
                      onChange={(e) =>
                        setMenu((pre) => ({
                          ...pre,
                          [e.target.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Component</label>
                    <input
                      className="form-control"
                      placeholder="Component"
                      name="component"
                      defaultValue={menu.component}
                      onChange={(e) =>
                        setMenu((pre) => ({
                          ...pre,
                          [e.target.name]: e.target.value,
                        }))
                      }
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
          post={createMenu}
        >
          <section>
            <div className="form-group">
              <label>Id Menu</label>
              <input className="form-control" placeholder="idMenu" readOnly />
            </div>
            <div className="form-group">
              <label>Name Menu</label>
              <input
                className="form-control"
                placeholder="Name Menu"
                name="nameMenu"
                onChange={(e) =>
                  setMenu((pre) => ({
                    ...pre,
                    [e.target.name]: e.target.value,
                  }))
                }
                defaultValue={menu.nameMenu}
              />
            </div>
            <div className="form-group">
              <label>Path</label>
              <input
                className="form-control"
                placeholder="Path Menu"
                name="Path"
                defaultValue={menu.Path}
                onChange={(e) =>
                  setMenu((pre) => ({
                    ...pre,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Component</label>
              <input
                className="form-control"
                placeholder="Component"
                name="component"
                defaultValue={menu.component}
                onChange={(e) =>
                  setMenu((pre) => ({
                    ...pre,
                    [e.target.name]: e.target.value,
                  }))
                }
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
          post={deleteAMenu}
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
            onClick={() => {
              setAdd(true);
            }}
            className="btn btn-success"
          >
            Add a Menu
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>Menu</th>
            <th>Path</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.slice(indexOfFirst, indexOfLast).map((menu) => {
            return (
              <tr key={menu.idMenu}>
                <td></td>
                <td>{menu.idMenu}</td>
                <td>{menu.nameMenu}</td>
                <td>{menu.Path}</td>

                <td>
                  {showEditBtn && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setId(menu.idMenu);
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
                        setId(menu.idMenu);
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
        totalPosts={menus.length}
        paginate={paginate}
      />
    </div>
  );
};

export default Menu;
