import { Posts } from "../../../Service/index";
import * as CONSTANT from "./constant";

export const getAllPosts = () => async (dispatch) => {
  try {
    const response = await Posts.GetAllPosts();
    console.log(response, "response");
    if (response.success) {
      console.log(response);
      dispatch({
        type: CONSTANT.GET_ALL_POSTS,
        payload: response.data,
      });
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error, "res is not success");
  }
};

export const createPost = (postData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await Posts.CreatePost(postData, token);
    console.log("Creating Post Response:", response);

    if (response.token && response.user) {
      const { user, token } = response;
      console.log(token, "token");
      console.log(user, "user");

      dispatch({
        type: CONSTANT.CREATE_POST,
        payload: { user, token },
      });
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error, "issue in creating post");
    return { success: false, message: error.message };
  }
};

export const getMyPost = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await Posts.GetMyPost(token);
    console.log(response, "get my post by action");
    if (response.token && response.user) {
      const { user, token } = response;
      console.log(user, "user");
      console.log(token, "token");

      dispatch({
        type: CONSTANT.GET_MY_POST,
        payload: { user, token },
      });
      console.log(response, "response");
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error, "issue in getting my post");
    return { success: false, msg: error.msg };
  }
};

export const getPostById = (id) => async(dispatch)=>{
  try{
    const token=localStorage.getItem("access_token");
    const response=await Posts.GetPostById(id,token);
    console.log(response,'response by action for get post by id');
    // if(response){
    //   const{token}=response;
    //   console.log(token,'token by action');

    dispatch({
      type:CONSTANT.GET_POST_BY_ID,
      payload:response,
    });
     console.log(response,'response after dispatch');
    return response;
    // }
  }catch(error){
console.log(error, "issue in getting my post");
    return { success: false, msg: error.msg };
  }
}

export const deletePostById =(_id)=> async(dispatch)=>{
  try{
    const token=localStorage.getItem('access_token');
    console.log(token,'token from deleting post');
    const response=await Posts.DeletPostById(_id,token);
    console.log(response,'response by deleting posts');
    dispatch({
      type:CONSTANT.DELETE_POST_BY_ID,
      payload:response,
    })
    console.log(response,'response after dispatching in delete post');
    return response;
  }catch(error){
    console.log(error, "issue in deleting post");
    return { success: false, msg: error.msg };
  }
}

export const updatePostById=(id,updatedPost) => async(dispatch)=>{
  try{
    const token =localStorage.getItem('access_token');
    console.log(token,'token from update post by id');
   const response= await Posts.UpdatePostById(id,updatedPost,token);
   console.log(response,'response from update post by id from action');
   dispatch({
    type:CONSTANT.UPDATE_POST_BY_ID,
    payload:response,
   })
   console.log(response,'response of update post after dispacth');
   return response;
  }catch(error){
    console.error(error,'issue in updating post.');
    return{success:false,msg:error.msg};
  }
}

export const image=(token,formData)=>async(dispatch)=>{
  try{
    const response=await Posts.image(token,formData);
    console.log(response,'response from image');
    dispatch({
      type:CONSTANT.IMAGE,
      payload:response,
    })
    console.log(response,'response after dispatch for image ');
    return response;
    }catch(error){
      console.error(error,'issue in image');
      return {success:false,msg:error.msg};
      }
}