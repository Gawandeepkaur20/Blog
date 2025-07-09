import store from "../../store";
import * as Action from "./Action";

// authObj is an object that has a logi method, which dispatches the login action from the action.js file
// to the Redux store.
const authObj = {
  login: (object) => store.dispatch(Action.login(object)),
  register:(object)=> store.dispatch(Action.register(object)),
  logout: () =>store.dispatch(Action.logout()),
  update:(id,updateData)=>store.dispatch(Action.updateUser(id,updateData)),
  getUser:()=>store.dispatch(Action.getUser()),
  deleteUser:(userId)=>store.dispatch(Action.deleteUser(userId)),
};

export default authObj;
