import {Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { RegisterLogicComponent } from "../../components/auth/RegisterLogicComponent";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const { registerUser } = RegisterLogicComponent();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(values);
    navigate("/login");
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
