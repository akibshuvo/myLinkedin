import React from 'react'
import Navber from '../component/Navber'
import { Link } from 'react-router-dom'
import Image from '../component/Image'
import man from '../assets/man3.png'
import Button from '@mui/material/Button';
import Myfriends from '../component/Myfriends'
import Request from '../component/Request'
import AllUser from '../component/AllUser'
import GroupList from '../component/GroupList'
import MyGroups from '../component/MyGroups'
import Block from '../component/Block'




const Friends = () => {
  return (
    <>
     <Navber/>
     <div className='allpage'> 
     <div className='menu'>
     <Link to="/home"><div className='items '>PROFILE</div></Link>
          <Link to="/friends"><div className='items active'>FRIENDS</div></Link>
          <Link to="/post"><div className='items'>POST</div></Link>
          <Link to="/mgs"><div className='items'>Massage</div></Link>
         </div>
     </div>

     <div className='fullBox'>
      <div className='myfriendAndReques'>
       
        <Myfriends/>
        <AllUser/>
      </div>
      <div className='myfriendAndReques'>
        
        <Request/>
        <Block/>
      </div>
      <div className='myfriendAndReques'>
        <MyGroups/>
        <GroupList/>
      </div>
     </div>
    </>
  )
}

export default Friends