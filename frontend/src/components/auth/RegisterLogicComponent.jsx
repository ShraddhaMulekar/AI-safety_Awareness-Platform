import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/UseFetch";

export const RegisterLogicComponent = () => {
  const { request } = useFetch();

  const registerUser = async (values) => {
    try {
      const data = await request({
        url: "/auth/register",
        method: "POST",
        body: values,
      });
      // console.log(data);

      if (data?.success) {
        alert("Registration Successful!");
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
