import { useLocation, useNavigate } from "react-router-dom";
import { UseFetch } from "../../hooks/UseFetch";

export const useLoginLogic = () => {
  const { request } = UseFetch();
  const navigate = useNavigate();
  const location = useLocation();

  const loginUser = async (values) => {
    try {
      const data = await request({
        url: "/auth/login",
        method: "POST",
        body: values,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");

        const from = location.state?.from;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        return;
      }

      alert(data?.message || "Login failed!");
    } catch (error) {
      alert(error?.message || "Login failed due to network error.");
    }
  };
  return { loginUser };
};