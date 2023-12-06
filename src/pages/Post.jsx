import React, { useEffect, useState } from 'react'
import Navber from '../component/Navber'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import profile from "../assets/profile.png"
import cover from "../assets/cover.png"
import TextField from '@mui/material/TextField';
import {RiGalleryLine} from 'react-icons/ri'
import {BsSend} from 'react-icons/bs'
import { GoKebabHorizontal } from "react-icons/go";
import { AiFillLike,AiFillDislike  } from "react-icons/ai";
import { IoIosShareAlt } from "react-icons/io";
import { useSelector } from 'react-redux'
import { getDatabase, ref, set, push, onValue, update, remove} from "firebase/database";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CiEdit } from "react-icons/ci";
import { MdDelete,MdOutlineBrowserUpdated } from "react-icons/md";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Post = () => {
  const db = getDatabase();

  let userinfo = useSelector(state=>state.logedUser.value)
  
  let [postValue,setPostValue] = useState("");
  let [postArr, setPostArr] = useState([]);

  let [showDeleteEdit, setShowDeleteEdit] = useState(false)
  let [btnShow, setBtnShow] = useState(false)
  let [postIdd, setPostId] = useState("")



  useEffect(()=>{
    const postRef = ref(db, 'postText');
    onValue(postRef, (snapshot) => {
      let arr = []
    snapshot.forEach(item=>{
        arr.push({...item.val(), postId: item.key})
    })
    setPostArr(arr)
});
  },[])
 

  let handleChange = (e)=>{
        setPostValue(
          e.target.value
        )
  }

  let handlePostClick = ()=>{
   if(postValue){
    set(push(ref(db, 'postText')), {
      whoPostName: userinfo.displayName,
      whoPostEmail: userinfo.email,
      whoPostId : userinfo.uid,
      postTopic: postValue
    });

    setPostValue("")
   }
    
  }

  

  let handleEdit = (item)=>{
    setPostValue(item.postTopic)
    setBtnShow(true) 
    setPostId(item)

  }

  let handleUpdatePost =  ()=>{
    update(ref(db,"postText/" + postIdd.postId),{
        postTopic: postValue
        
    })
    setPostValue("")
    setBtnShow(false) 
  }

  let handleDeletePost = (item)=>{
      remove(ref(db,'postText/' +item.postId))
  }


  return (
    <>
    <div>
    <Navber/>
    <div className='allpage'> 
     <div className='menu'>
     <Link to="/home"><div className='items '>PROFILE</div></Link>
          <Link to="/friends"><div className='items '>FRIENDS</div></Link>
          <Link to="/post"><div className='items active'>POST</div></Link>
          <Link to="/mgs"><div className='items'>Massage</div></Link>
         </div>
     </div>
    </div>
    
    <div className='fullbody'>
      <div className="container">
        <div className='allcontent'>
            <div className='postAndProfile'>
              <div className='contentSite'>
                <div>
                  <div className='postBox'>
                    <h3>NEW POST</h3>
                    <div className='inputBtn'>
                    <input onChange={handleChange} className='postinput' type="text" placeholder='What’s on your mind?' value={postValue}/>
                    <div className='iconsSend'>
                      <RiGalleryLine/>
                      <div className='iconBg'>
{btnShow
?<MdOutlineBrowserUpdated onClick={handleUpdatePost} className='senIcons'/>
:<BsSend onClick={handlePostClick} className='senIcons'/>}
                      
                      
                      </div>
                    </div>
                    </div>
                    
                    
                  </div>
                </div>
                {/* post show site start */}

{postArr.map(item=>(
    <div>
    <ul >
      <li className='postboxx'>
        {/* <div className='ed'>
      <CiEdit />
      <MdDelete className='deletecolor'/>
      </div> */}

      

    

      <div className='nameimagePost'>
        <Image className="postImge" src={profile}/>
        <div>
          <h3 className='postnamem'>{item.whoPostName}</h3>
          <p className='postPP'>iOS developer!</p>
        </div>
      </div>
      <p className='postpublic'>{item.postTopic}</p>

{item.whoPostId == userinfo.uid 
? <div className='likeDisIcons'>
<Button onClick={()=>handleDeletePost(item)} color='error' variant="contained">delete</Button>
<Button onClick={()=>handleEdit(item)} className='editBtn' variant="contained">edit</Button>
</div>

: <div className='likeDisIcons'>
<AiFillDislike/>
<AiFillLike/>
<IoIosShareAlt/>
</div>

 
}
       

       
      </li>
    </ul>

    
  </div>
))}
                


                {/* post show site end */}
                
              </div>




              <div className='profileContent'>
                <div className='profileBox'>
                  <div className='ppppppp'>
                  <Image className="cover" src={cover}/>
                  <div>
                  <Image className="pro"  src={profile}/>
                  </div>
                  </div>
                  <div className='proTextContent'>
                    <h2 className='proName'>{userinfo.displayName}</h2>
                    <p className='proP'>Freelance UX/UI designer, 80+ projects  in web design, mobile apps (iOS & android) and creative projects. Open to offers.</p>
                  </div>
                 
                      
                </div>
              </div>
            </div>
           </div>
      </div>
    </div>
    </>
  )
}

export default Post