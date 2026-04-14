import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { loginLogic } from "../../components/auth/LoginLogicComponent";

export const LoginPage = () => {
  // const navigate = useNavigate();
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const { loginUser } = loginLogic();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(values);
    // navigate(to="/"); 
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
          placeholder="you@example.com"
        />
        <input
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
          placeholder="password"
        />
        <button>Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};