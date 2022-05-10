import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes({ isAllowed, redirectPage, children }) {
  if (!isAllowed) {
    return <Navigate to={redirectPage} replace />;
  }
  return children ? children : <Outlet />;
}

export default ProtectedRoutes;
