import { useNavigate } from "react-router-dom";
import { UseFetch } from "../../hooks/UseFetch";

export const RegisterLogicComponent = () => {
  const { request } = UseFetch();

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
