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
import { IoIosShareAlt } from "react-icons/io";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { activeChat } from '../slices/activeChatSlice'
import { useDispatch } from 'react-redux'


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


const Mgs = () => {

  const db = getDatabase();
  const storage = getStorage();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  
  let userInfo = useSelector(state => state.activeChat.value)
  let data = useSelector(state=> state.logedUser.value)

  let dispatch = useDispatch()

  let groupData = useSelector(state=> state.groupChat.value)

  let [mgs,setMgs] = useState("")
  let [mgsArr, setMgsArr] = useState([])
  let [groupMgsArr, setGroupMgsArr] = useState([])
  let [fArr, setmyFriendsarr] = useState([])
  let [forwardMsg, setForword] = useState([])
  let [show,setshow] = useState(false)
  let [audios,setAudios] = useState("")

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);

    setAudios(blob)
  };
  
 


  useEffect(()=>{
    const db = getDatabase();
    const gmgsRef = ref(db, 'singleMassage');
    onValue(gmgsRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
         
         if((data.uid == item.val().whosendId && userInfo.activaChatid == item.val().whoRevivedId) 
         || 
        (data.uid == item.val().whoRevivedId && userInfo.activaChatid == item.val().whosendId)){
           arr.push({...item.val(), msgIds: item.key})
         }
      })

      setMgsArr(arr)
    });
  },[userInfo.activaChatid])

  useEffect(()=>{
    const db = getDatabase();
    const mgsRef = ref(db, 'groupsMsg');
    onValue(mgsRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
        
        //  if((data.uid == item.val().whosendId && userInfo.activaChatid == item.val().whoRevivedId) 
        //  || 
        // (data.uid == item.val().whoRevivedId && userInfo.activaChatid == item.val().whosendId))
        
        // {
          if(item.val().whoRevivedId == userInfo.activaChatid){
            arr.push({...item.val(), gMsgIds: item.key})

          }
        //  }
      })

      setGroupMgsArr(arr)
    });
  },[userInfo.activaChatid])

  useEffect(()=>{
    const friendRef = ref(db, 'myFriends');
    onValue(friendRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
        if(data.uid == item.val().acceptId || data.uid == item.val().myFriendId){
          arr.push({...item.val(), myFriensId: item.key})
        }
        
      })
      setmyFriendsarr(arr)
    });
  },[])


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
      set(push(ref(db, 'groupsMsg')), {
        whosendName: data.displayName,
        whosendId: data.uid,
        whosendPhoto: data.photoURL,
  
        whoRecivedName: userInfo.activaChatName,
        whoRevivedId: userInfo.activaChatid,
        massage: mgs,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    }
  }

  let handleFile = (e)=>{
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
          set(push(ref(db, 'groupsMsg')), {
            whosendName: data.displayName,
            whosendId: data.uid,
      
            whoRecivedName: userInfo.activaChatName,
            whoRevivedId: userInfo.activaChatid,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes}`
          });
        }
      });
});
  }

  let handleAudioSend = (e)=>{
    const storageRef = imgref(storage, Date.now().toString());
    uploadBytes(storageRef,audios).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {

        // console.log("aaaaa", audios,downloadURL)
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
          set(push(ref(db, 'groupsMsg')), {
            whosendName: data.displayName,
            whosendId: data.uid,
      
            whoRecivedName: userInfo.activaChatName,
            whoRevivedId: userInfo.activaChatid,
            audios: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes}`
          });
        }
      });
});
  }

  let handleOpenssss = (item)=>{
    console.log(item,"aaaa")
      set(push(ref(db, 'forwardsMgsss')), {
      formgs: item.massage
    });
    setOpen(true)
  }

  let handleForwwwwwww = (item)=>{
    console.log(item,"my")
    const fmwwRef = ref(db, 'forwardsMgsss');
    onValue(fmwwRef, (snapshot) => {
     snapshot.forEach(items=>{
      
         set(push(ref(db, 'singleMassage')), {
           whosendName: item.displayName,
           whosendId: item.acceptName,
     
           whoRecivedName: item.myFriendsName,
           whoRevivedId: item.myFriendId,
           forwordMassage: items.val().formgs,
           
         });
         
 })
})

// .then(()=>{
//   if(data.uid == item.acceptId){
//     dispatch(activeChat({
//       type: "single",
//       activaChatName: item.myFriendsName,
//       activaChatid: item.myFriendId
//     }))

//   }else{
//     dispatch(activeChat({
//       type: "single",
//       activaChatName: item.acceptName,
//       activaChatid: item.acceptId
//     }))
//   }
// })

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

         
          {userInfo.type == "single" 
          ?  mgsArr.map(items=>(

            items.massage? 
             items.whosendId == data.uid
             ? 
             <div className='sendmgs'>
             <p>{items.massage}</p>
             {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
           </div>
                  
              

             :<div className='recivedMgs'>
             <p>{items.massage}</p>
             {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
           </div>
            : items.forwordMassage? 
            items.whosendId == data.uid?
            <div className='sendmgs'>
             <p>{items.forwordMassage}</p>
             {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
           </div>
            : <div className='recivedMgs'>
            <p>{items.forwordMassage}</p>
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
 
          ))
          : groupMgsArr.map(items=>(
            items.massage? 
            items.whosendId == data.uid
            ? <div className='sendmgs'>
            <p>{items.massage}</p>
            {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
          </div>
            :
            <>
            <div >
             
            <p className='nameE'>{items.whosendName}</p>
            </div>
            <div className='mgsNP'>
            <Image className="mgsph" src={items.whosendPhoto}/>
            <div className='recivedMgs'>
            <p>{items.massage}</p>
            {/* <span>{moment(items.data, "YYYYMMDD hh:mm").fromNow()}</span> */}
          </div>
          <IoIosShareAlt onClick={()=>handleOpenssss(items)} className='forword'/>
          </div>
          
          </>
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
          ))
          }
         
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

            <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          <h2>Forward Massage</h2>
          </Typography>

          {fArr.map(item=>(
            <div className='oneFriend'>
            <div className='imgName'>
                <Image src={man}/>
                <div>
                <h3>{data.uid == item.acceptId?item.myFriendsName:item.acceptName}</h3>
                <p>Apps Developer</p>
                </div>
            </div>
            <button onClick={()=>handleForwwwwwww(item)}>forward</button>
            </div>
          ))}
          
          
        </Box>
      </Modal>
    </div>
            
            
            
            
        </div>
     </div>
        </>
  )
}

export default Mgs