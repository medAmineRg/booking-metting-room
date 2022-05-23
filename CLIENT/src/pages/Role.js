import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  getRoles,
  reset,
  postRole,
  deleteRole,
  updateRole,
} from "../features/role/roleSlice";
import Spinner from "../compenents/UI/Spinner";
import useAuth from "../hooks/has-auth";

const Role = () => {
  const { role, isLoading } = useSelector((state) => state.role);
  const { currentMenu } = useSelector((state) => state.menus);
  const { showAddBtn, showEditBtn, showDeleteBtn } = useAuth(currentMenu);

  const [id, setId] = useState(null);

  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [roleName, setRoleName] = useState("");
  const dispatch = useDispatch();

  const onChange = (e) => {
    setRoleName(e.target.value);
  };

  const createRole = () => {
    dispatch(postRole({ roleName }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAdd(false);
        setRoleName("");
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deleteRol = () => {
    dispatch(deleteRole(id))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAsk(false);
        setId(null);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const updateRol = async () => {
    dispatch(updateRole({ id, nameRole: roleName }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getRoles());
        setOpen(false);
        setId(null);
        setRoleName("");
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  useEffect(() => {
    dispatch(getRoles());
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
          post={updateRol}
          submit="Submit"
        >
          {role.map((rol) => {
            if (rol.idRole === id) {
              return (
                <section className="from" key={rol.idRole}>
                  <div className="form-group">
                    <label>Id Role</label>
                    <input
                      className="form-control"
                      defaultValue={rol.idRole}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Name Role</label>
                    <input
                      className="form-control"
                      defaultValue={rol.nameRole}
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
          open={add}
          onClose={() => setAdd(false)}
          submit={"Submit"}
          post={createRole}
        >
          <section>
            <div className="form-group">
              <label>Id Role</label>
              <input className="form-control" placeholder="idRole" readOnly />
            </div>
            <div className="form-group">
              <label>Name Role</label>
              <input
                className="form-control"
                placeholder="Name Role"
                onChange={(e) => {
                  setRoleName(e.target.value);
                }}
                defaultValue={roleName}
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
          post={deleteRol}
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
            Add a Role
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {role.slice(indexOfFirst, indexOfLast).map((rol) => {
            return (
              <tr key={rol.idRole}>
                <td></td>
                <td>{rol.idRole}</td>
                <td>{rol.nameRole}</td>
                <td>
                  {showEditBtn && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setId(rol.idRole);
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
                        setId(rol.idRole);
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
        totalPosts={role.length}
        paginate={paginate}
      />
    </div>
  );
};

export default Role;
