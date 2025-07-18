import { toast } from "react-toastify";
import { Auth } from "../../../Service/index";
import * as CONSTANTS from "./constant";




// LOGIN ACTION
export const login = (object) => async (dispatch) => {
  dispatch({ type: CONSTANTS.LOGIN_START });

  try {
    const response = await Auth.loginUser(object);
    console.log(response, "respoense");
    console.log("Login Response:", response.token);
    if (response.token && response.user) {
      const { user, token } = response;

      console.log(token, "token");
      console.log(user, "user");

      localStorage.setItem("access_token", token);
      localStorage.setItem("isAuthenticated", "true");

      dispatch({
        type: CONSTANTS.LOGIN_SUCCESSFULLY,
        payload: { token, user },
      });

//       toast.success(
//   <div style={{ display: "flex", flexDirection: "column" }}>
//     <strong>Login Successful!</strong>
//     <small>Welcome back 🎉</small>
//   </div>

// );
toast.success("Login Successful!", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color: "#fff",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});

      return response;
    } else {
      console.log("Invalid user:Login Failed");
      dispatch({ type: CONSTANTS.LOGIN_FAILURE });
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch({ type: CONSTANTS.LOGIN_FAILURE });
  }
};
// REGISTER ACTION
export const register = (object) => async (dispatch) => {
  try {
    const response = await Auth.registerUser(object);
    console.log("Register Response:", response);

    if (response.success) {
      dispatch({ type: CONSTANTS.REGISTER_SUCCESSFULLY });
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.error("Register error:", error);
  }
};
export const updateUser = (id, updateData) => async (dispatch) => {
  dispatch({ type: CONSTANTS.UPDATE_START });

  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const token = localStorage.getItem("access_token");
    console.log(token);
    console.log(isAuthenticated);
    const response = await Auth.updateUser(id, updateData, token);
    console.log(response, "response of updating user.");
    if (response.success) {
      dispatch({
        type: CONSTANTS.UPDATE_SUCCESS,
        payload: { user: response.data },
      });
     
      toast.success("Account updated successfully!", {
                 
            position: "top-left",
            style: {
              marginTop: "50px",
              backgroundColor: "#B9B2A8",
              color: "#3b2f2f",
              fontFamily: "'Wix Madefor Display', serif"
            }
          });    
      console.log(response, "user data after updating");
      return response;
    } else {
      dispatch({ type: CONSTANTS.UPDATE_FAILURE });
    }
  } catch (error) {
    console.error("Update error:", error);
    dispatch({ type: CONSTANTS.UPDATE_FAILURE });
  }
};

export const getUser = () => async (dispatch) => {
  try {
    console.log("getuser running");
    const token = localStorage.getItem("access_token");
    console.log(token);
    const response = await Auth.getUser(token);
    console.log("getuser in action.js", response);

    if (response.success) {
      dispatch({
        type: CONSTANTS.GET_USER,
        payload: response.user,
      });
      console.log("user get successfully", response.user);
      return response;
    }
  } catch (error) {
    console.error("fetching user error:", error);
  }
};

// LOGOUT ACTION
export const logout = () => (dispatch) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("isAuthenticated");

  dispatch({ type: CONSTANTS.LOGOUT });
  dispatch({ type: CONSTANTS.GET_USER, payload: { user: null } });
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await Auth.deleteUser(token, userId);
    console.log("delete user response", response);
    if (response.success) {
      dispatch({ type: CONSTANTS.DELETE_USER });
      localStorage.removeItem("access_token");
      localStorage.removeItem("isAuthenticated");
    }
    return response;
  } catch (error) {
    console.error("delete user error", error);
  }
};

