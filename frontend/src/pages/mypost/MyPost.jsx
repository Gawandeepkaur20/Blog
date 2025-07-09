import {useEffect,useState} from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import { injectModels } from '../../Redux/injectModel'


const Mypost = (props) => {
   const [data,setData] = useState([])
    async function  getMyPost(){
      try{
        const response = await props.posts.getMyPost(); 
        console.log('response from myposts', response);
        setData(response);
       }
      catch(error){
        console.log('Fails to give data',error);
      }
    }
      useEffect(()=>{
        getMyPost();
      },[])
  return (
    <>
    <Header />
    <div className="home">
     {data ? <Posts data={data} /> : <p>Loading...</p>}

    </div>
  </>
  )
}

export default injectModels(['posts'])(Mypost);