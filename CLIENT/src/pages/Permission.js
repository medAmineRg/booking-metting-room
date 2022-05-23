import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../compenents/UI/Modal";
import Pagination from "../compenents/UI/Pagination";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  getPermissions,
  reset,
  createPermission,
  deletePermission,
  updatePermission,
} from "../features/permission/permissionSlice";
import "../index.css";
import Spinner from "../compenents/UI/Spinner";
import useAuth from "../hooks/has-auth";

const Permission = () => {
  const { permission, isLoading } = useSelector((state) => state.per);
  const dispatch = useDispatch();

  const { currentMenu } = useSelector((state) => state.menus);
  const { showAddBtn, showEditBtn, showDeleteBtn } = useAuth(currentMenu);

  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [ask, setAsk] = useState(false);

  const [id, setId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perName, setPerName] = useState("");
  const [postsPerPage] = useState(5);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  const onChange = (e) => {
    setPerName(e.target.value);
  };

  const postPer = () => {
    dispatch(createPermission({ namePer: perName }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setAdd(false);
        setPerName("");
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const deletePer = () => {
    dispatch(deletePermission(id))
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

  const updatePer = () => {
    dispatch(updatePermission({ id, perName }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getPermissions());
        setOpen(false);
        setPerName("");
        setId(null);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    dispatch(getPermissions());

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
          post={updatePer}
          submit={"Submit"}
        >
          {permission.map((per) => {
            if (per.idPer === id) {
              return (
                <section className="from" key={per.idPer}>
                  <div className="form-group">
                    <label>Id Permission</label>
                    <input
                      className="form-control"
                      defaultValue={per.idPer}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Name Permission</label>
                    <input
                      className="form-control"
                      defaultValue={per.namePer}
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
          post={postPer}
        >
          <section>
            <div className="form-group">
              <label>Id Permission</label>
              <input
                className="form-control"
                placeholder="id Permission"
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Name Permission</label>
              <input
                className="form-control"
                placeholder="Permission Name"
                onChange={(e) => {
                  setPerName(e.target.value);
                }}
                defaultValue={perName}
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
          post={deletePer}
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
            Add a Permission
          </button>
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>Permission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permission.slice(indexOfFirst, indexOfLast).map((per) => {
            return (
              <tr key={per.idPer}>
                <td></td>
                <td>{per.idPer}</td>
                <td>{per.namePer}</td>
                <td>
                  {showEditBtn && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setId(per.idPer);
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
                        setId(per.idPer);
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
        totalPosts={permission.length}
        paginate={paginate}
      />
    </div>
  );
};

export default Permission;
