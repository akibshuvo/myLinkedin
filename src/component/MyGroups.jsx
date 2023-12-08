import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import man from '../assets/man3.png'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { getDatabase, ref, set, push, remove, onValue } from "firebase/database";
import { useSelector } from 'react-redux';
import Myfriends from './Myfriends';
import { useDispatch } from 'react-redux';
import { HiUserRemove } from "react-icons/hi";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const styless = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const MyGroups = () => {
  const db = getDatabase();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [opens, setOpens] = useState(false);
  // const handleOpens = () => setOpens(true);
  const handleCloses = () => setOpens(false);

  const [openss, setOpenss] = useState(false);
  // const handleOpenss = () => 
  const handleClosess = () => setOpenss(false);

  let [inputValue, setInputValue] = useState("");
  let [groupArr, setGroupArr] = useState([]);
  let [myFriendsArr, setmyFriendsarr] = useState([])
  let [memberArr, setMemberArr] = useState([])
  let [memberListArr, setMemberListarr] = useState([])

  let [memGroupId, setMemGroupId] = useState("")

  let userInfo = useSelector(state=>state.logedUser.value)
  let dispatch = useDispatch()


  let handleChangeInput = (e)=>{
    setInputValue(e.target.value);
  }

  let handleClick = ()=>{
    set(push(ref(db, 'groupCeate')), {
      groupName: inputValue,
      whoCreateGroup: userInfo.displayName,
      whoCreateId : userInfo.uid
    });

    setOpen(false)
  }

  useEffect(()=>{
    const groupsRef = ref(db, 'groupCeate');
    onValue(groupsRef, (snapshot) => {
      let arr = []
    snapshot.forEach(item=>{
      if(userInfo.uid == item.val().whoCreateId){
        arr.push({...item.val(), groupId: item.key})
      }
      
    })
    setGroupArr(arr)
});
  },[])

 

  useEffect(()=>{
    const friendRef = ref(db, 'myFriends');
    onValue(friendRef, (snapshot) => {
      let arr = []
      snapshot.forEach(item=>{
        if(userInfo.uid == item.val().acceptId || userInfo.uid == item.val().myFriendId){
          arr.push({...item.val(), myFriensId: item.key})
        }
        
        
      })
      setmyFriendsarr(arr)
    });
  },[])

  // useEffect(()=>{

  // },[])

  // let handleAddGroups = (item,)=>{
  //   set(push(ref(db, 'groupMember')), {
  //     adminName: userInfo.displayName,
  //     adminId: userInfo.email,

  //     joinPeopleName: item.acceptName,
  //     joinPeopleid: item.acceptId,
      
  //   });
  //   console.log(item);
  // }


  let handleOpenss = (item)=>{

      const reqRef = ref(db, 'reqGroups');
      onValue(reqRef, (snapshot) => {
        let arr = []
      snapshot.forEach(items=>{
      if(items.val().groupId == item.groupId){
         arr.push({...items.val(), reqId: items.key})
      }
      })

      setMemberArr(arr)
      setMemGroupId(item.groupId)
});
setOpenss(true);
  }

  let handleAcppetgroup = (item)=>{
    console.log(item,"ssssssssooooo")
      set(push(ref(db, 'memberList')), {
       whoAccept: userInfo.uid,
       whoAcceptName: userInfo.displayName,

       reqPeopleId: item.whoReqId,
       reqPeopleName: item.whoReqName,
       groupsId: item.groupId 

      })
      .then(()=>{
        remove(ref(db,'reqGroups/'+ item.reqId))
      })
  }


  let handleOpens = (item)=>{
    console.log(item.groupId, "cheack")
    const memberRef = ref(db, 'memberList');
    onValue(memberRef, (snapshot) => {
      let arr = []
      snapshot.forEach(items=>{
        
        if(items.val().groupsId == item.groupId && userInfo.uid == items.val().whoAccept){
          arr.push({...items.val(), memberIdss: items.key})
        }

        console.log(items.val(),"member anchi")

        
        
        
      })
    
      setMemberListarr(arr)
    });
    setOpens(true)
  }

  let handleAccpetDelete = (item)=>{
    remove(ref(db,'reqGroups/'+ item.reqId))
  }

  let handleRemoveMember = (item)=>{
    remove(ref(db,'memberList/'+ item.memberIdss))
  }
  

  

  return (
    <>
    <div className='myFriend'>
      <div className='groupCreate'>
      <h1>My Groups</h1>
      
      <h1 onClick={handleOpen}>+</h1>

    
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
            Create your Groups.
            
          </Typography>
          
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField onChange={handleChangeInput} className='inputGroup' id="outlined-basic" label="Enter your group name" variant="outlined" />
          <div className='groupCreateBtn'>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button onClick={handleClick} className='createggg' variant="contained">Create</Button>
          </div>
          </Typography>
        </Box>
      </Modal>
    </div>

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
        <Button onClick={()=>handleOpens(item)} className='mgsBtn' variant="contained">member</Button>
        <Button onClick={()=>handleOpenss(item)} color='info' variant="contained">req list</Button>
        <Button color='error' variant="contained">Delete</Button>
        </div>
        </div>
    ))}

       <div>
      <Modal
        open={opens}
        onClose={handleCloses}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles}>
        <h1>Groups Member</h1>

          {memberListArr.map(item=>(
            <>
          
            <div className='oneFriend'>
              
            <div className='imgName'>
                <Image src={man}/>
                <div>
                <h3>{item.reqPeopleName}</h3>
                <p>Apps Developer</p>
                </div>
            </div>
            <div className='allBtn'>
            <Button onClick={()=>handleRemoveMember(item)} color='error' variant="contained">remove</Button>
            
            </div>
            </div>
            </>
          ))}
        
          
         
         
          
        </Box>
      </Modal>
    </div>

    <div>
      
      <Modal
        open={openss}
        onClose={handleClosess}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styless}>
    <div className='reqAndMember'>

      <div>
        <h2>Request People</h2>

        {memberArr.map(item=>(
           <div className='reqgroupss'>
           <div className='imgName'>
               <Image src={man}/>
               <div>
               <h3>{item.whoReqName}</h3>
               <p>Apps Developer</p>
               </div>
           </div>
           <div className='groupReqbtn'>
           <Button onClick={()=>handleAcppetgroup(item)} className='acceptgroup' variant="contained">Accept</Button>
           <Button onClick={()=>handleAccpetDelete(item)} color='error' variant="contained">Delete</Button>
           </div>
           </div>
        ))}
          
          
          </div>


      {/* <div>
        <h2>Member List</h2>
        {memberListArr.map(items=>(
            <div className='reqgroupss'>
            <div className='imgName'>
                <Image src={man}/>
                <div>
                <h3>{items.reqPeopleName}</h3>
                <p>Apps Developer</p>
                </div>
            </div>
            <div className='groupReqbtn'>
            
            <HiUserRemove className='remove'/>
            </div>
            </div>
        ))}
          
          </div> */}

          

          </div>
          
        </Box>
      </Modal>
    </div>
      
     
     
     
    </div>
</>
  )
}

export default MyGroups