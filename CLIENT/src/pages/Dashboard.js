import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DigDate from "../compenents/UI/DigDate";
import Spinner from "../compenents/UI/Spinner";
const Dashboard = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login", { replace: true });
  }, [navigate, user]);
  if (isLoading) return <Spinner />;
  return (
    <div className="dashboard">
      <DigDate />
    </div>
  );
};

export default Dashboard;
