import React, { useEffect, useState } from 'react'
import Navber from '../component/Navber'
import { Link } from 'react-router-dom'
import Myfriends from '../component/Myfriends'
import Image from '../component/Image'
import man from '../assets/man3.png'
import {BsCameraVideoFill,BsFillEmojiSunglassesFill,BsFillSendFill,BsFillGiftFill} from 'react-icons/bs'
import {BiSolidPhoneCall} from 'react-icons/bi'
import {ImCancelCircle} from 'react-icons/im'

import {RiGalleryFill} from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { getDatabase, ref, set,push,onValue  } from "firebase/database";
import MyGroups from '../component/MyGroups'
import p3 from '../assets/p3.png'
import msd from '../assets/msg.png'
import ModalImage from "react-modal-image";
import EmojiPicker from 'emoji-picker-react';


const Mgs = () => {
  const db = getDatabase();


  let userInfo = useSelector(state => state.activeChat.value)
  let data = useSelector(state=> state.logedUser.value)

  let [mgs,setMgs] = useState("")
  let [mgsArr, setMgsArr] = useState([])
  let [show,setshow] = useState(false)
  
  let handleSendMgs = ()=>{
   
    set(push(ref(db, 'massage')), {
      whosendName: data.displayName,
      whosendId: data.uid,

      whoRecivedName: userInfo.activaChatName,
      whoRevivedId: userInfo.activaChatid,
      massage: mgs
    });

    
  }


  useEffect(()=>{
    const db = getDatabase();
    const mgsRef = ref(db, 'massage');
    onValue(mgsRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
         console.log(item.val())
         if((data.uid == item.val().whosendId && userInfo.activaChatid == item.val().whoRevivedId) || (data.uid == item.val().whoRevivedId && userInfo.activaChatid == item.val().whosendId)){
           arr.push(item.val())
         }
      })

      setMgsArr(arr)
    });
  },[])



  return (
    <>
    <Navber/>
     <div className='allpage'> 
     <div className='menu'>
     <Link to="/home"><div className='items '>PROFILE</div></Link>
          <Link to="/friends"><div className='items '>FRIENDS</div></Link>
          <Link to="/post"><div className='items'>POST</div></Link>
          <Link to="/post"><div className='items active'>Massage</div></Link>
         </div>
     </div>

    <div className='frndAndmgs'>
        <div className='boxx'>
          
          <div className='gandf'>
            <div className='mgsList'>
                <Myfriends/>
            </div>
            <div className='mgsList'>
                <MyGroups/>
            </div>
            </div>


            <div className='mgsgsbox'>
              <div className='mgsnavpadding'>
            <div className='mgsNav'>
              <div className='firstline'>
                <div className='nameAndProfile'>
                <Image className='prsize' src={man}/>
                <div>
                <h4 className='namedis'>{userInfo.activaChatName}</h4>
                <p className='activeago'>active 2h ago</p>
                </div>
                </div>
                </div>
                <div>
                <BiSolidPhoneCall className='callIcon'/>
                <BsCameraVideoFill className='callIcon'/>
                <ImCancelCircle className='callIcons'/>
                
                </div>
              </div>
              </div>
             <div className='textMgs'>
              <div>
                <div>
              <Image className='prsizesss' src={man}/>
              <p className='prsiz'>Linkedin</p>
              <p className='prsizes'>You're not friends on Linkedin
         Works at KPMG Rahman Rahman Huq, Fiverr and Google Maps
         </p>
         </div>

         <div>
          {/* {mgsArr.map(item=>(
             item.whosendId == data.uid
             ? <div className='sendmgs'>
             <p>{item.massage}</p>
           </div>
             :<div className='recivedMgs'>
             <p>{item.massage}</p>
           </div>
            
           
          ))} */}
          <div className='sendmgs'>
             <p>Hi</p>
           </div>
             <div className='recivedMgs'>
             <p>Hello</p>
           </div>

          
          <div className='sendmgs'>
          <ModalImage
                small={msd}
                large={msd} 
              />
           </div>

             <div className='recivedMgs'>
              
             <ModalImage
                small={msd}
                large={msd}
                
              />
              
             {/* <Image className="msgPics" src={msd}/> */}
           </div>

           <div className='sendAudio'>
            <audio controls></audio>
            </div>

           <div className='recivedAudio'>
            <audio controls></audio>
            </div>

           <div className='sendvideo'>
           <video width="320" height="240" controls></video>
            </div>

           <div className='recivedvideo'>
           <video width="320" height="240" controls></video>

            </div>
           
            
           
         </div>
              </div>
             
            </div>

            <div className='inputMgs'>
              
              <BsFillGiftFill/>
              <RiGalleryFill className='emojiGlass'/>
          <input onChange={(e)=>setMgs(e.target.value)} className='sendMgsInput' type="text" placeholder='Write your message...'/>
          <BsFillEmojiSunglassesFill onClick={()=>setshow(!show)}/>
          <BsFillSendFill onClick={handleSendMgs}/>
          
          </div>
          {show &&
          <div className="emoji">
          <EmojiPicker/>
          </div>
          }
          
            </div>
            
            
        </div>
     </div>
        </>
  )
}

export default Mgs