import axios from "axios";
import { API_URL } from "@/env";
import { getToken } from "../utils/token";

export interface ProfileData {
  display_picture?: string;
  name: string;
  email: string;
  age: number;
  sport_interests: { [key: string]: number };
}

export interface ProfileResponse {
  profile: ProfileData;
}

export interface CheckProfileResponse {
  hasProfile: boolean;
}

// @route   GET /api/profile/check
// @desc    Check if user has a profile
export const checkProfileAsync = async (): Promise<CheckProfileResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token");
    }
    const response = await axios.get(`${API_URL}/profile/check`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 401) {
      throw new Error("Authentication failed");
    }
    throw new Error("Failed to check profile");
  }
};

// @route   GET /api/profile
// @desc    Get user profile
export const getProfileAsync = async (): Promise<ProfileData> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token");
    }
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data.profile;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 401) {
      throw new Error("Authentication failed");
    }
    if (error.response?.status === 404) {
      throw new Error("Profile not found");
    }
    throw new Error("Failed to get profile");
  }
};

// @route   POST /api/profile
// @desc    Create user profile
export const createProfileAsync = async (profileData: {
  display_picture?: string;
  name?: string;
  age: number;
  sport_interests?: { [key: string]: number };
}): Promise<ProfileData> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token");
    }
    const response = await axios.post(
      `${API_URL}/profile`,
      profileData,
      {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.profile;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 401) {
      throw new Error("Authentication failed");
    }
    if (error.response?.status === 400) {
      const msg = error.response?.data?.msg || "Invalid profile data";
      throw new Error(msg);
    }
    throw new Error("Failed to create profile");
  }
};

// @route   PUT /api/profile
// @desc    Update user profile
export const updateProfileAsync = async (profileData: {
  display_picture?: string;
  name?: string;
  age?: number;
  sport_interests?: { [key: string]: number };
}): Promise<ProfileData> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token");
    }
    const response = await axios.put(
      `${API_URL}/profile`,
      profileData,
      {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.profile;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 401) {
      throw new Error("Authentication failed");
    }
    if (error.response?.status === 400) {
      const msg = error.response?.data?.msg || "Invalid profile data";
      throw new Error(msg);
    }
    throw new Error("Failed to update profile");
  }
};

