import { NavLink } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { FaUserLock } from "react-icons/fa";
import { CgMenuRound } from "react-icons/cg";
import { FaUsersCog } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { currentMenu } from "../../features/menu/menuSlice";

function SideBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  let menus = user.user.Role.Menu;
  let dispatch = useDispatch();
  const icons = {
    Dashboard: <AiOutlineDashboard />,
    Role: <FaUserShield />,
    Permission: <FaUserLock />,
    Menu: <CgMenuRound />,
    User: <FiUsers />,
    RolePerMenu: <FaUsersCog />,
    Room: <MdMeetingRoom />,
    Booking: <IoTicketOutline />,
    MyCalendar: <BsCalendarDate />,
    SearchRoom: <BsSearch />,
  };
  return (
    <div className="sidebar">
      <ul className="sidbar_list">
        {menus.map((menu, i) => {
          return (
            <NavLink key={menu.idMenu} to={menu.Path}>
              <li
                className="sidebar_list-row"
                id={window.location.pathname === menu.Path ? "active" : ""}
              >
                <div
                  className="sidebar_list-menu"
                  onClick={async () => {
                    localStorage.setItem("whereAt", JSON.stringify(menu));
                    await dispatch(currentMenu(menu));
                  }}
                >
                  {icons[menu.component]}
                  <p style={{ paddingLeft: "1rem " }}>{menu.nameMenu}</p>
                </div>
              </li>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
