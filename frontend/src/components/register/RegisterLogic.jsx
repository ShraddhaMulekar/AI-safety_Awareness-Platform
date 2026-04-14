import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/UseFetch";

export const RegisterLogic = () => {
  const { request } = useFetch();
  const navigate = useNavigate()

  const registerUser = async (values) => {
    try {
      const data = await request("/auth/register", "POST", values);
      console.log(data);

      if (data?.ok) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        alert(data?.message || "Registration Failed!");
      }
    } catch (error) {
      alert("An error occurred during registration!");
      throw error;
    }
  };
  return { registerUser };
};