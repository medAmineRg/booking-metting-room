import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./compenents/UI/SideBar";
import Header from "./compenents/UI/Header";
import Spinner from "./compenents/UI/Spinner";
import ProtectedRoutes from "./compenents/Auth/ProtectedRoutes";

const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Permission = lazy(() => import("./pages/Permission"));
const Role = lazy(() => import("./pages/Role"));
const Menu = lazy(() => import("./pages/Menu"));
const User = lazy(() => import("./pages/Users"));
const RolePerMenu = lazy(() => import("./pages/RolePerMenu"));
const Room = lazy(() => import("./pages/Room"));
const Booking = lazy(() => import("./pages/Bookings"));
const Calendar = lazy(() => import("./pages/Calendar"));
const SearchRoom = lazy(() => import("./pages/SearchRoom"));
const Join = lazy(() => import("./pages/JoinRoom"));
const Meeting = lazy(() => import("./pages/VideoRoom"));


function App() {
  const { user } = useSelector((state) => state.auth);
  const arrComp = {
    Dashboard: <Dashboard />,
    Permission: <Permission />,
    Role: <Role />,
    Menu: <Menu />,
    User: <User />,
    RolePerMenu: <RolePerMenu />,
    Room: <Room />,
    Booking: <Booking />,
    MyCalendar: <Calendar />,
    SearchRoom: <SearchRoom />,
    Join: <Join/>
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
            <Route
              path="/login"
              element={
                <Suspense fallback={<Spinner />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <Suspense fallback={<Spinner />}>
                  <Register />
                </Suspense>
              }
            />

            {/* Routes comming from DB */}
            {menus &&
              menus.map((menu, i) => {
                return (
                  <Route
                    key={i}
                    path={menu.Path}
                    element={
                      <Suspense fallback={<Spinner />}>
                        {arrComp[menu.component]}
                      </Suspense>
                    }
                  />
                );
              })}

            {/* Routes for Autenficated users */}
            <Route
              element={
                <ProtectedRoutes redirectPage="/login" isAllowed={!!user} />
              }
            >
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<Spinner />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/"
                element={<Navigate replace to={"/Dashboard"} />}
              />
            </Route>

            {/* <Route path="/video" element={<Suspense fallback={<Spinner />}>
                    <Join />
                  </Suspense>}/> */}
            <Route path="/video/:id" element={<Suspense fallback={<Spinner />}>
                    <Meeting />
                  </Suspense>}/>


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
