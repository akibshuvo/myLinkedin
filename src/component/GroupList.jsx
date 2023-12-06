import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import man from '../assets/man3.png'
import Button from '@mui/material/Button';
import { getDatabase, ref, set, push, remove, onValue } from "firebase/database";
import { useSelector } from 'react-redux';

const GroupList = () => {
  const db = getDatabase();

  let userInfo = useSelector(state=>state.logedUser.value)

  let [groupArr, setGroupArr] = useState([])
  let [reqGroup, setReqGroup] = useState([])
 


  useEffect(()=>{
    const groupsRef = ref(db, 'groupCeate');
    onValue(groupsRef, (snapshot) => {
      let arr = []
    snapshot.forEach(item=>{
      if(userInfo.uid != item.val().whoCreateId){
        arr.push({...item.val(), groupId: item.key})
      }
      
    })
    setGroupArr(arr)
});
  },[])

  useEffect(()=>{
    const groupsRef = ref(db, 'reqGroups');
    onValue(groupsRef, (snapshot) => {
      let arr = []
    snapshot.forEach(item=>{

      if(item.val().whoReqId == userInfo.uid){
        arr.push(item.val().groupId+item.val().whoReqId)  
      }
                
 
    })

    setReqGroup(arr)
});
  },[])

  
  let handleGroupJoin = (item)=>{ 
     set(push(ref(db, 'reqGroups')), {
      ...item,
      whoReqName: userInfo.displayName,
      whoReqId: userInfo.uid
    });
    
  
  }


  let handleCancelGroup = (item)=>{
    const starCancelRef = ref(db, 'reqGroups');
    let reqIds = ""
    onValue(starCancelRef, (snapshot) => {   
    snapshot.forEach(items=>{ 
      if(items.val().groupId == item.groupId){
           reqIds = items.key    
      }
    })
});
remove(ref(db,'reqGroups/'+ reqIds))
  }

 
  return (
    <>
    <div className='myFriend'>
      <h1>All Groups List</h1>

      {groupArr.map(item=>(
          <div className='oneFriend'>
          <div className='imgName'>
              <Image src={man}/>
              <div>
              <h3>{item.groupName}</h3>
              <p>Admin:__{item.whoCreateGroup}</p>
              </div>
          </div>
          <div className='allBtn'>

        {reqGroup.includes(item.groupId+userInfo.uid) || reqGroup.includes(userInfo.uid+item.groupId)
        ?<>
        <Button className='mgsBtn' variant="contained">pandding</Button>
        <Button onClick={()=>handleCancelGroup(item)} color='error' variant="contained">cancel</Button>
        </>
        : 
        
        <Button onClick={()=>handleGroupJoin(item)} className='mgsBtn' variant="contained">join +</Button>
        
        }

          
          {/* <Button color='info' variant="contained">Unfreind</Button> */}
          {/* <Button color='error' variant="contained">block</Button> */}
          </div>
          </div>
      ))}
      
     
    </div>
</>
  )
}

export default GroupList