import { userRegistration, userLogin } from "../services/authService";
import Swal from 'sweetalert2';

export const registerUser = async (userData, navigate) => {
  try {
    await userRegistration(userData);
    navigate('/login');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: error?.message || 'Something went wrong!',
    });
    console.error("Registration error:", error);
  }
};

export const loginUser = async (userData, navigate) => {
  try {
    await userLogin(userData);
    navigate('/home');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Username or password incorrect',
    });
    console.error("Login error:", error);
  }
};
