import { API_ENDPOINTS } from "./Endpoint";
import axios from "axios";
import { ResponseEnum } from "./constant";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const GetAllPosts = async () => {
  try {
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.GET_ALL_POST}`;
console.log(url);
    const response = await axios.get(url);
    console.log(response.data, "response");
    if (response.data.success === ResponseEnum.SUCCESS) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Getting all post Error:", error);
    return { success: false, message: error.message };
  }
};


export const CreatePost = async (postData, token) => {
  try {
    console.log('creating post')
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.CREATE_POST}`;
    console.log(url);
    const response = await axios.post(url, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("Post creation response:", response);

    if (response.data.success === ResponseEnum.SUCCESS) {
         console.log(response.data,'success to create post');
      return response.data; 
    } else {
      console.log(response.data,'failed to create post');
      return response.data;
    }
  } catch (error) {
    console.error("Creating post Error:", error);
    return { success: false, message: error.message };
  }
};


export const GetMyPost= async(token)=>{
  try{
    console.log('get all post');
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.GET_MY_POST}`
    console.log('url of getting all my post',token);
     const response =await axios.get(url,{
      headers:{
        'Authorization': `Bearer ${token}`,
      }
     })
     console.log(response.data.msg,'response of getting my post');
      if (response.data.success === ResponseEnum.SUCCESS) {
         console.log(response.data.msg,'success to create post');
      return response.data.msg; 
    } else {
      console.log(response.data,'failed to create post');
      return response.data.msg;
    }
  } catch (error) {
    console.error("Creating post Error:", error);
    return { success: false, message: error.message };
  }
}

export const GetPostById = async(id,token)=>{
  try{
    const url=`${REACT_APP_API_BASE_URL}${API_ENDPOINTS.GET_POST_BY_ID}${id}`
    console.log(url,'url of userId for getting posts');
    console.log(token,'token by getpostid');
    const response=await axios.get(url,{
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });
    console.log(response.data.msg,'response from get post by id');
    if(response.data.success===ResponseEnum.SUCCESS){
console.log(response.data.msg,'response after success');
return response.data.msg;
    }
  }catch(error){
     console.error("getting post by id Error:", error);
    return { success: false, message: error.message };
  }
}

export const DeletPostById = async(_id,token)=>{
  try{
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.DELETE_POST_BY_ID}${_id}`
    console.log(url,'url of delete post by id');
    console.log(token,'token of delete post by id');
    const response = await axios.delete(url,{
      headers:{
        'Authorization': `Bearer ${token}`,
        }
  });
  console.log(response,'response from delete post by id');
  console.log(response.data.msg,'res by data.msg');
  if(response.data.success===ResponseEnum.SUCCESS){
    console.log(response.data.msg,'response after success');
    return response.data.msg;
  }
}catch(error){
    console.error("deleting post by id Error:", error);
    return { success: false, message: error.message };
}
}

export const UpdatePostById= async(_id,updatedPost,token)=>{
  try{
    const url=`${REACT_APP_API_BASE_URL}${API_ENDPOINTS.UPDATE_POST_BY_ID}${_id}`
    console.log(url,'url from update post by id');
    console.log(token,'token by update post by id');
    const response=await axios.put(url,updatedPost,{
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });
    console.log(response,'response from updating post by id');
    console.log(response.data.msg,'response.data.msg');
    if(response.data.success===ResponseEnum.SUCCESS){
      console.log(response.data.msg,'response.data.msg after success');
      return response;
    }
  }catch(error){
    console.error("Update post by id Error:",error);
    return{success:false,msg:error.msg};
  }
}

export const image = async (token,formData) => {
  try {
    const url = `${REACT_APP_API_BASE_URL}${API_ENDPOINTS.IMAGE}`;
    const response = await axios.post(url,formData, {
      headers: {
        Authorization: `Bearer ${token}`,
         
      },
    });
    if (response.status === ResponseEnum.STATUS) {
      console.log(response.data, "success in fetching image data");
      return response.data;
    }
  } catch (error) {
    console.error("Error in image API:", error);
    return { success: false, message: error.message };
  }
};