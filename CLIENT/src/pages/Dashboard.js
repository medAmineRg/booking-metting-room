import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="container flex-welcome">
      <div>
        <p>&#128075; Welcome {user.user.fullName} !</p>
      </div>

      <div>
        <p>
          <b>Our app will help you book a metting room easily!</b>
        </p>
      </div>
      <div className="container-btn">
        <Link className="btn btn-success" to={"/search-room"}>
          Book A Room
        </Link>
        <Link className="btn btn-warning" to={"/calendar"}>
          Go To the Calendar
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
