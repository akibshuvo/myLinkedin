import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import man from '../assets/man3.png'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const Block = () => {
  const db = getDatabase();

  let userInfo = useSelector(state=>state.logedUser.value)

  let [blockArr, setBlockArr] = useState([]);
  
  useEffect(()=>{
  const blockRef = ref(db, 'block');
  onValue(blockRef, (snapshot) => {
    let arr = []
   snapshot.forEach(item=>{
     arr.push({...item.val(), blockId: item.key})
     
   })

   setBlockArr(arr)
  
});
  },[])


  let handleUnblock = (item)=>{
         remove(ref(db,'block/' + item.blockId))
  }
  return (
    <>
    <div className='myFriend'>
      <h1>Block List</h1>

      {blockArr.map(item=>(
        <div className='oneFriend'>
      <div className='imgName'>
          <Image src={man}/>
          <div>
          <h3>{item.blockKhaise}</h3>
          <p>Apps Developer</p>
          </div>
      </div>
      <div className='allBtn'>
      {/* <Button className='mgsBtn' variant="contained">Massage</Button>
      <Button color='info' variant="contained">Unfreind</Button> */}
      {item.marchiAmiId == userInfo.uid&&<Button onClick={()=>handleUnblock(item)} color='error' variant="contained">unblock</Button>}
      
      
      
      </div>
      </div>
      ))}
      
      
     
    </div>
</>
  )
}

export default Block