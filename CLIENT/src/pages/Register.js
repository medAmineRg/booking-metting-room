import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import { userSchemaReg } from "../Validation/UserValidation";
import { FaUser } from "react-icons/fa";
import Spinner from "../compenents/UI/Spinner";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    password: "",
    password2: "",
  });

  const { fullName, phone, email, password, password2 } = formData;
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message, isPending } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success(message);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, isPending]);

  const onChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        fullName,
        email,
        password,
        phone,
      };
      try {
        await userSchemaReg.validate(userData);
        dispatch(register(userData));
      } catch (error) {
        return toast.error(error.errors[0]);
      }
    }
  };
  if (isLoading) return <Spinner />;

  return (
    <div className="login">
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Register and start booking rooms</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              value={email}
              onChange={onChange}
              type="email"
              className="form-control"
              name="email"
              placeholder="email"
            />
          </div>
          <div className="form-group">
            <input
              value={phone}
              onChange={onChange}
              type="text"
              className="form-control"
              name="phone"
              placeholder="Phone Number"
            />
          </div>

          <div className="form-group">
            <input
              value={fullName}
              onChange={onChange}
              type="text"
              className="form-control"
              name="fullName"
              placeholder="Fullname"
            />
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={onChange}
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
            />
          </div>
          <div className="form-group">
            <input
              value={password2}
              onChange={onChange}
              type="password"
              className="form-control"
              name="password2"
              placeholder="Confirm password"
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
