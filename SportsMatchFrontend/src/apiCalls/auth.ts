import axios from "axios";
import { API_URL } from "@/env";
import { saveToken } from "../utils/token";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      if (response.data.token) {
        await saveToken(response.data.token);
        return response.data.token;
      } else {
        throw new Error("No token");
      }
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      throw new Error("Invalid credentials");
    } else {
      throw new Error("Login failed");
    }
  }
};

export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/signup`,
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      return true;
    } else {
      throw new Error("Signup failed");
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      throw new Error("User already exists");
    } else {
      throw new Error("Signup failed");
    }
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify`,
      { email, otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      if (response.data.token) {
        await saveToken(response.data.token);
        return response.data.token;
      } else {
        throw new Error("No token");
      }
    } else {
      throw new Error("Verification failed");
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      throw new Error("Invalid OTP");
    } else {
      throw new Error("Verification failed");
    }
  }
};
