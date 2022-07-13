import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../compenents/UI/Modal";
import { AiOutlineDelete, AiOutlineCheckSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "../compenents/UI/Spinner";
import { getVirtualRooms, reset } from "../features/video/videoSlice";
import Pagination from "../compenents/UI/Pagination";

export default function JoinRoom() {
  const { virtualRooms, isLoading } = useSelector(state => state.virtualRooms);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const [room, setRoom] = useState(null);
  const [toogleModal, setToogleModale] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVirtualRooms());
    return function cleanup() {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;
  return (
    <div className="container">
      <table className="content-table">
        <thead>
          <tr>
            <th>Virtual Room</th>
            <th>Privacy</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {virtualRooms.slice(indexOfFirst, indexOfLast).map(room => {
            return (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.privacy}</td>
                <td>
                  <button
                    className="btn btn-success"
                    style={{ margin: "0 auto", padding: "10px 13px" }}
                  >
                    <a href={room.url}>Join</a>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={virtualRooms.length}
        paginate={paginate}
      />
    </div>
  );
}

// <Modal
//       open={toogleModal}
//       onClose={() => {
//         setToogleModale(false)
//         navigate("/booking", { replace: true });

//       }}
//       submit={"Submit"}
//       post={() => {
//           window.location.assign(`/video/${room}`);
//         }}
//     >
//       <section>
//         <div className="form-group">
//           <label>Room Name that you want to join or either create</label>
//           <input type="text" onChange={(e) => setRoom(e.target.value)} />
//         </div>
//       </section>
//     </Modal>
