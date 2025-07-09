import * as Action from './Action';
import store from '../../store';

const postsObj={
 getAllPosts: ()=>store.dispatch(Action.getAllPosts()),
 createPost:(postData)=>store.dispatch(Action.createPost(postData)),
 getMyPost:()=>store.dispatch(Action.getMyPost()),
 getPostById:(id)=>store.dispatch(Action.getPostById(id)),
 deletePostById:(_id)=>store.dispatch(Action.deletePostById(_id)),
 updatePostById:(id,updatedPost)=>store.dispatch(Action.updatePostById(id,updatedPost)),
 image:(token,formData)=>store.dispatch(Action.image(token,formData)),
}

export default postsObj;