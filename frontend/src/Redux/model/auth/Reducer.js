import * as CONSTANT from "./constant";

const initialState = {
  isLoggedin: false,
  access_token: null,
  registrationSuccess: false,
  user: null,
  isFetching: false,
  error: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANT.LOGIN_START:
      return {
        ...state,
        isFetching: true,
        error: false,
      };

    case CONSTANT.LOGIN_SUCCESSFULLY:
      return {
        ...state,
        access_token: action.payload.token,
        user: action.payload.user,
        isLoggedin: true,
        isFetching: false,
        error: false,
      };

    case CONSTANT.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        isLoggedin: false,
        access_token: null,
        user: null,
      };

    case CONSTANT.REGISTER_SUCCESSFULLY:
      return {
        ...state,
        registrationSuccess: true,
      };

    case CONSTANT.UPDATE_START:
      return {
        ...state,
        isFetching: true,
        user: null,
        access_token: null,
      };

    case CONSTANT.UPDATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isFetching: false,
        error: false,
      };

    case CONSTANT.UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        user: null,
        access_token: null,
      };

    case CONSTANT.LOGOUT:
      return {
        ...initialState,
      };
    case CONSTANT.GET_USER:
      return {
        ...state,
        user: action.payload,
        access_token: state.access_token,
        isFetching: false,
        error: false,
      };
      case CONSTANT.DELETE_USER:
        return{
          ...initialState,
        }
    default:
      return state;
  }
};

export default authReducer;
