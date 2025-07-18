// REDUX(INJECT-MODEL)

import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./model/auth/Reducer";
import postReducer from "./model/posts/Reducer";
import userReducer from "./slices/userSlice";
const rootReducers = combineReducers({
 user: userReducer,
  auth: authReducer,
  posts:postReducer,

});
const store = createStore(rootReducers, applyMiddleware(thunk));
export default store;