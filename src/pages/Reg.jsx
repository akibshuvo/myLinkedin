import React, { useState } from 'react'
import Image from '../component/Image'
import Logo from '../assets/Logo.png'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { getAuth, createUserWithEmailAndPassword,updateProfile  } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner';
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDatabase, ref, set,push } from "firebase/database";

const Reg = () => {
  const auth = getAuth();
  const db = getDatabase();

  let data = useSelector(state=> state.logedUser.value)

  useEffect(()=>{
    if(data){
      navigate("/home")
    }
  })

  let [errorName, setNameError] = useState("")
  let [errorEmail, setEmailError] = useState("")
  let [errorPassword, setPasswordError] = useState("")
  let [btnLoder, setBtnLoder] = useState(true);
  let [eyesShow, setEyesShow] = useState(true);

  let navigate = useNavigate()

  let [inputValue, setInputValue] = useState({
    fullname: "",
    email: "",
    password: ""
  })

  let handleChange = (e)=>{
     setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value
     })

     if(inputValue.fullname){
      setNameError("")
     }
     if(inputValue.email){
      setEmailError("")
     }
     if(inputValue.password){
      setPasswordError("")
     }
  }

  let handleRegClick = ()=>{
    if(!inputValue.fullname){
      setNameError("Please Enter Your Name");
    }
    if(!inputValue.email){
      setEmailError("Please Enter Your Email");
    }
    if(!inputValue.password){
      setPasswordError("Please Enter Your Password");
    }

    if(inputValue.fullname && inputValue.email && inputValue.password){
      setBtnLoder(false)
      
      createUserWithEmailAndPassword(auth, inputValue.email, inputValue.password).then((user) => {
        updateProfile(auth.currentUser, {
          displayName: inputValue.fullname,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/linkedin-b344e.appspot.com/o/profile.png?alt=media&token=0a417dd3-5234-4ca6-90db-e895183ad015"
        }).then(()=>{
          set(push(ref(db, 'users')), {
            username: inputValue.fullname,
            profile_picture : "https://firebasestorage.googleapis.com/v0/b/linkedin-b344e.appspot.com/o/profile.png?alt=media&token=0a417dd3-5234-4ca6-90db-e895183ad015"
          }).then(()=>{
            set(push(ref(db, 'allUser')), {
              userName: user.user.displayName,
              email: user.user.email,
              userId : user.user.uid
            });
          })
        })
      toast.success('Registration SuccessFul', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setBtnLoder(true)
        navigate("/login")
     })
   .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    if(errorCode.includes('email')){
      
      toast.error('Email already used', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        }); 
        setBtnLoder(true)
    }
    
  });

    }
    
  }


  return (
    <>

      <div className='regPage'>
        <div className='pageContent'>
        <Image src={Logo}/>
        <h1 className='regHeading'>Get started with easily register</h1>
        <p className='regP'>Free register and you can enjoy it</p>

        <div className='inputBox'>

        <TextField onChange={handleChange} name='fullname' className='inputs' id="outlined-basic" label="Full Name" variant="outlined" />
        {errorName &&
        <Alert className='alertw' severity="error">{errorName}</Alert>
        }
      

        <TextField onChange={handleChange} name='email' className='inputs' id="outlined-basic" label="Email" variant="outlined" />
        {errorEmail &&
        <Alert className='alertw' severity="error">{errorEmail}</Alert>
        }
        

        <TextField onChange={handleChange} name='password' className='inputs' id="outlined-basic" label="Password" type={eyesShow?'password':'text'}
        variant="outlined" />
         {errorPassword &&
        <Alert className='alertw' severity="error">{errorPassword}</Alert>
      }
      {eyesShow 
      ? <AiFillEyeInvisible onClick={()=>setEyesShow(false)} className='eyes'/>
      : <AiFillEye onClick={()=>setEyesShow(true)} className='eyes'/>
      }
      
      

{btnLoder
?<Button onClick={handleRegClick} className='regBtn' variant="contained">Sign up</Button>
: <Button className='regBtn' variant="contained">
<Bars
    height="35"
    width="80"
    color="#fff"
    ariaLabel="bars-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
/>  
  </Button>
}
       
      
       <p className='loginP'>Already  have an account ? <Link to="/login"><span className='span'>Sign In</span> </Link> </p>

        
        </div>
        </div>
      </div>
     
    
    </>
  )
}

export default Reg