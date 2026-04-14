import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/UseFetch";

export const loginLogic = () => {
  const { request } = useFetch();
  const navigate = useNavigate();
  const location = useLocation();

  const loginUser = async (values) => {
    try {
      const data = await request("/auth/login", "POST", values);
    //   console.log(data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");

        const from = location.state?.from;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        alert(data?.message || "Login failed!");
      }
    } catch (error) {
      throw error;
    }
  };
  return { loginUser };
};