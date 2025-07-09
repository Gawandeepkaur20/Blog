import * as CONSTANT from "./constant";

const initialState = {
  data: [],
  post: null,
  uploadedImage: null,
};
const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANT.GET_ALL_POSTS:
      return {
        ...state,
        data: action.payload,
      };
    case CONSTANT.CREATE_POST:
      return {
        ...state,
        post: action.payload,
      };
    case CONSTANT.GET_MY_POST:
      return {
        ...state,
        data: action.payload,
      };
    case CONSTANT.GET_POST_BY_ID:
      return {
        ...state,
        post: action.payload,
      };
    case CONSTANT.DELETE_POST_BY_ID:
      return {
        ...state,
        post: action.payload,
      };
    case CONSTANT.UPDATE_POST_BY_ID:
      return {
        ...state,
        post: action.payload,
      };
    case CONSTANT.IMAGE:
      return {
        ...state,
        uploadedImage: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
