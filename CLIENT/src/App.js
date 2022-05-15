import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyCalendar from "./compenents/Calendar/MyCalendar";
import SideBar from "./compenents/UI/SideBar";
import Header from "./compenents/UI/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Permission from "./pages/Permission";
import Role from "./pages/Role";
import User from "./pages/Users";
import Room from "./pages/Room";
import Booking from "./pages/Bookings";
import SearchRoom from "./pages/SearchRoom";
import RolePerMenu from "./pages/RolePerMenu";

import Menu from "./pages/Menu";
import ProtectedRoutes from "./compenents/Auth/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import Spinner from "./compenents/UI/Spinner";

function App() {
  const { user } = useSelector((state) => state.auth);
  const arrComp = {
    Permission: <Permission />,
    Role: <Role />,
    Menu: <Menu />,
    User: <User />,
    RolePerMenu: <RolePerMenu />,
    Room: <Room />,
    Booking: <Booking />,
    MyCalendar: <MyCalendar />,
    SearchRoom: <SearchRoom />,
  };
  let menus;
  if (user) {
    menus = user.user.Role.Menu;
  }

  return (
    <>
      <div className="grid">
        <Router>
          <Header />
          {user && <SideBar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes comming from DB */}
            {menus &&
              menus.map((menu, i) => {
                return (
                  <Route
                    key={i}
                    path={menu.Path}
                    element={arrComp[menu.component]}
                  />
                );
              })}

            {/* Routes for Autenficated users */}
            <Route
              element={
                <ProtectedRoutes redirectPage="/login" isAllowed={!!user} />
              }
            >
              <Route path="/" element={<Dashboard />} />
            </Route>

            {/* catch any unvailable routes */}
            <Route
              path="*"
              element={
                <Suspense fallback={<Spinner />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
