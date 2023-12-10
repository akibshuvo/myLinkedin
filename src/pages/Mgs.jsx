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
import { AudioRecorder } from 'react-audio-voice-recorder';
import { getStorage, ref as imgref,getDownloadURL,uploadBytes } from "firebase/storage";
import { RiDeleteBin2Line  } from "react-icons/ri";


const Mgs = () => {
  const db = getDatabase();
  const storage = getStorage();
  
  let userInfo = useSelector(state => state.activeChat.value)
  let data = useSelector(state=> state.logedUser.value)


  let [mgs,setMgs] = useState("")
  let [mgsArr, setMgsArr] = useState([])
  let [show,setshow] = useState(false)
  let [audios,setAudios] = useState("")

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    
    console.log(blob)
    setAudios(blob)
  };
  
  let handleSendMgs = ()=>{
    if(userInfo.type == 'single'){
      set(push(ref(db, 'singleMassage')), {
        whosendName: data.displayName,
        whosendId: data.uid,
  
        whoRecivedName: userInfo.activaChatName,
        whoRevivedId: userInfo.activaChatid,
        massage: mgs,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    }else{
      console.log("group er ta hobe")
    }
  }


  useEffect(()=>{
    const db = getDatabase();
    const mgsRef = ref(db, 'singleMassage');
    onValue(mgsRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
         console.log(item.val(), "msssss data")
         if((data.uid == item.val().whosendId && userInfo.activaChatid == item.val().whoRevivedId) 
         || 
        (data.uid == item.val().whoRevivedId && userInfo.activaChatid == item.val().whosendId)){
           arr.push({...item.val(), msgIds: item.key})
         }
      })

      setMgsArr(arr)
    });
  },[userInfo.activaChatid])


  let handleFile = (e)=>{
    console.log(e.target.files[0],"ooooo")
    const storageRef = imgref(storage, e.target.files[0].name);

    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        if(userInfo.type == 'single'){
          set(push(ref(db, 'singleMassage')), {
            whosendName: data.displayName,
            whosendId: data.uid,
      
            whoRecivedName: userInfo.activaChatName,
            whoRevivedId: userInfo.activaChatid,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes}`
          });
        }else{
          console.log("group er ta hobe")
        }
      });
});
  }

  let handleAudioSend = (e)=>{
    const storageRef = imgref(storage, Date.now().toString());

    uploadBytes(storageRef,audios).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {

        console.log("aaaaa", audios,downloadURL)
        if(userInfo.type == 'single'){
          set(push(ref(db, 'singleMassage')), {
            whosendName: data.displayName,
            whosendId: data.uid,
      
            whoRecivedName: userInfo.activaChatName,
            whoRevivedId: userInfo.activaChatid,
            audios: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes}`
          });
          setAudios("")
        }else{
          console.log("group er ta hobe")
        }
      });
});
  }

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
          {mgsArr.map(items=>(

            items.massage? 
             items.whosendId == data.uid
             ? <div className='sendmgs'>
             <p>{items.massage}</p>
             {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
             
           </div>
             :<div className='recivedMgs'>
             <p>{items.massage}</p>
             {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
           </div>
            :
            items.audios
            ? 
            items.whosendId == data.uid
            ?
            <div className='sendAudio'>
            <audio src={items.audios} controls></audio>
            </div>
            :
           <div className='recivedAudio'>
            <audio src={items.audios} controls></audio>
            </div>
            :
            items.whosendId == data.uid
            ?
            <div className='sendmgs'>
            <ModalImage
                  small={items.img}
                  large={items.img} 
                />
                {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
             </div>
             
            :  <div className='recivedMgs'>
            <ModalImage
               small={items.img}
               large={items.img}  
             />        
             {/* <span>{moment(items.date, "YYYYMMDD hh:mm").fromNow()}</span> */}
          </div>
          
           
          ))}
          {/* <div className='sendmgs'>
             <p>Hi</p>
           </div>
             <div className='recivedMgs'>
             <p>Hello</p>
           </div> */}

          
          {/* <div className='sendmgs'>
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
           </div> */}

           {/* <div className='sendAudio'>
            <audio controls></audio>
            </div>

           <div className='recivedAudio'>
            <audio controls></audio>
            </div> */}

           {/* <div className='sendvideo'>
           <video width="320" height="240" controls></video>
            </div> */}

           {/* <div className='recivedvideo'>
           <video width="320" height="240" controls></video>

            </div> */}
           
            
           
         </div>
              </div>
             
            </div>

            <div className='inputMgs'>
              
        {audios 
        ? 
        <div className='audiosend'>
        <audio src={URL.createObjectURL(audios)} controls></audio>
        <RiDeleteBin2Line onClick={()=>setAudios("")}  className='ausioDelet'/>
        <BsFillSendFill onClick={handleAudioSend}/>

        </div>
        :
        <>
            <div className='adioRec'>
            <AudioRecorder 
           onRecordingComplete={addAudioElement}
           audioTrackConstraints={{
           noiseSuppression: true,
           echoCancellation: true,
         }} 
         
       />
            </div>
                 <label>
                   <input className='sendmgsinput' type="file" hidden onChange={handleFile}/>
                 <RiGalleryFill className='emojiGlass'/>
                 </label>
             <input value={mgs} onChange={(e)=>setMgs(e.target.value)} className='sendMgsInput' type="text" placeholder='Write your message...'/>
             <BsFillEmojiSunglassesFill onClick={()=>setshow(!show)}/>
             <BsFillSendFill onClick={handleSendMgs}/>
             </>
             }
          </div>
          {show &&
          <div className="emoji">
          <EmojiPicker onEmojiClick={(e)=>setMgs(e.emoji+mgs)}/>
          </div>
          }
         
          
            </div>
            
            
        </div>
     </div>
        </>
  )
}

export default Mgs