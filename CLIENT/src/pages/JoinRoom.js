import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../compenents/UI/Modal";

export default function JoinRoom() {
  const [room, setRoom] = useState(null);
  const [toogleModal, setToogleModale] = useState(true)
  const navigate = useNavigate()
  // const onSubmit = () => {
  //   window.location.assign(`/video/${room}`);
  // };

  return (
    <Modal
          open={toogleModal}
          onClose={() => {
            setToogleModale(false)
            navigate("/booking", { replace: true });

          }}
          submit={"Submit"}
          post={() => {
              window.location.assign(`/video/${room}`);
            }}
        >
          <section>
            <div className="form-group">
              <label>Room Name that you want to join or either create</label>
              <input type="text" onChange={(e) => setRoom(e.target.value)} />
            </div>
          </section>
        </Modal>
  );
}
