import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import man from '../assets/man3.png'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, remove,set, push  } from "firebase/database";
import { useSelector } from 'react-redux';

const Request = () => {
  const db = getDatabase();

  let [reqArr, setReqArr] = useState([])

  let userInfo = useSelector(state=> state.logedUser.value)
 

  useEffect(()=>{
  const reqRef = ref(db, 'reqList');
  onValue(reqRef, (snapshot) => {
  let arr = []
  snapshot.forEach(item=>{
    if(userInfo.uid == item.val().recevierUserId){
      arr.push({...item.val(), reqId: item.key})
    }
  })
  setReqArr(arr)
});
  },[])

  let handleCanelReq = (item)=>{
   remove(ref(db,"reqList/" + item.reqId))
 
  }

  let handleAccept = (item)=>{
    set(push(ref(db, 'myFriends')), {
      myFriendsName: item.iReqName,
      myFriendId: item.iReqUserId,
      acceptName: item.recevierName,
      acceptId: item.recevierUserId
      
    }).then(()=>{
      remove(ref(db,'reqList/' + item.reqId))
    })

    
  }



  return (
    <>
    <div className='myFriend'>
      <h1>Friends Request</h1>

      {reqArr.map(item=>(
 <div className='oneFriend'>
 <div className='imgName'>
     <Image src={man}/>
     <div>
     <h3>{item.iReqName}</h3>
     <p>Apps Developer</p>
     </div>
 </div>
 <div className='allBtn'>
 <Button onClick={()=>handleAccept(item)} className='mgsBtn' variant="contained">Accepts</Button>
 {/* <Button color='info' variant="contained">Unfreind</Button> */}
 <Button onClick={()=>handleCanelReq(item)} color='error' variant="contained">Cancel</Button>
 </div>
 </div>
      ))}
     
     
     
    </div>
</>
  )
}

export default Request