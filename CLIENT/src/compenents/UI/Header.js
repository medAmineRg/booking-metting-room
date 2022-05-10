import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="header">
      <Link className="header__container--logo" to="/">
        Booking Metting Rooms
      </Link>
      <div className="header__container--link">
        <ul>
          {user ? (
            <li>
              <button className="btn btn-reverse" onClick={onLogout}>
                <FaSignOutAlt />
                Lougout
              </button>
            </li>
          ) : (
            <>
              <li>
                <FaSignInAlt />

                <Link to="/login">Login</Link>
              </li>
              <li>
                <FaUserAlt />

                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
