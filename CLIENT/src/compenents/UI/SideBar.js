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

function SideBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  let menus = user.user.Role.Menu;
  const icons = [
    <FaUserShield />,
    <FaUserLock />,
    <CgMenuRound />,
    <FiUsers />,
    <FaUsersCog />,
    <MdMeetingRoom />,
    <IoTicketOutline />,
    <BsCalendarDate />,
    <BsSearch />,
  ];
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
                  onClick={() => {
                    localStorage.setItem("whereAt", JSON.stringify(menu));
                  }}
                >
                  {icons[i]}
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
