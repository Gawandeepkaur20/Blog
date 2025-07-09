import { API_ENDPOINTS } from "./Endpoint";
import axios from "axios";
import { ResponseEnum } from "./constant";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const registerUser = async (object) => {
  try {
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.REGISTER_USER}`;
    // console.log(url)
    const response = await axios.post(url, object, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(response, "response");

    if (response.data.success === ResponseEnum.SUCCESS) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: error.message };
  }
};

export const loginUser = async (object) => {
  try {
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.LOGIN_USER}`;
    console.log(url);
    const response = await axios.post(url, object, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("data from login", response);
    console.log(response.status === ResponseEnum.STATUS, "response.status");
    console.log(
      response.data.success === ResponseEnum.SUCCESS,
      "response .success"
    );
    if (response.data.success === ResponseEnum.SUCCESS) {
      console.log("data from login1", response.data);
      return response.data;
    } else {
      console.log("Full response data from login:", response.data);
      throw new Error(response.data.message || "Invalid email or password");
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
    // return { success: false, message: error.message };
  }
};

export const updateUser = async (id, updateData, token) => {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.UPDATE_USER_BY_Id}${id}`;
    console.log("Update URL:", url);
    console.log(token, "token from update auth");
    const response = await axios.put(url, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response from Update User:", response);

    console.log(response.status === ResponseEnum.STATUS, "response.status");
    console.log(
      response.data.success === ResponseEnum.SUCCESS,
      "response .success"
    );
    if (response.data.success === ResponseEnum.SUCCESS) {
      console.log("User updated successfully:", response.data);
      return response.data;
    } else {
      console.log("User update failed:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Update User Error:", error);
    return { success: false, message: error.message };
  }
};

export const getUser = async (token) => {
  try {
    if (!token) throw new Error("Missing token");
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.GET_USER}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === ResponseEnum.STATUS) {
      console.log(response.data, "success in fetching user data");
      return response.data;
    }
  } catch (error) {
    console.error("Error in getUser API:", error);
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (token, id) => {
  try {
    if (!token) throw new Error("Missing token");
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.DELETE_USER_BY_ID}${id}`;
    console.log(url, "url of delete account");
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === ResponseEnum.STATUS) {
      console.log(response.data, "success in deleting user data");
      return response.data;
    }
  } catch (error) {
    console.error("Error in deleteUser API:", error);
    return { success: false, message: error.message };
  }
};


