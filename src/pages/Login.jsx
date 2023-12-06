import React,{useEffect, useState} from 'react'
import Image from '../component/Image'
import Logo from '../assets/Logo.png'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import {FcGoogle} from 'react-icons/fc'
import {BsFacebook} from 'react-icons/bs'
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup  } from "firebase/auth";
import { getDatabase, push, ref, set } from "firebase/database";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner';
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { useDispatch,useSelector } from 'react-redux';
import { logedUser } from '../slices/userSlice';



const Login = () => {
  const db = getDatabase();
  const auth = getAuth();
  let dispatch = useDispatch()
  
  let data = useSelector(state=> state.logedUser.value)

  useEffect(()=>{
    if(data){
      navigate("/home")
    }
  })


  let navigate = useNavigate()
  const provider = new GoogleAuthProvider();

  
  let [errorEmail, setEmailError] = useState("")
  let [errorPassword, setPasswordError] = useState("")
  let [eyesShow, setEyesShow] = useState(true);
  let [btnLoder, setBtnLoder] = useState(true);


  let [inputValue, setInputValue] = useState({
    email: "",
    password: ""
  })

  let handleChange = (e)=>{
     setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value
     })

     if(inputValue.email){
      setEmailError("")
     }
     if(inputValue.password){
      setPasswordError("")
     }
  }

  let handleRegClick = ()=>{

    if(!inputValue.email){
      setEmailError("Please Enter Your Email");
    }
    if(!inputValue.password){
      setPasswordError("Please Enter Your Password");
    }

    if(inputValue.email && inputValue.password){
      setBtnLoder(false)
      signInWithEmailAndPassword(auth, inputValue.email, inputValue.password)
      .then((user) => {
        navigate("/home")
        dispatch(logedUser(user.user))
        localStorage.setItem("user",JSON.stringify(user.user))
     })
      
    
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    if(errorCode.includes("auth")){
      toast.error('Something this wrong', {
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

  let handleGoogleLoging = ()=>{
    signInWithPopup(auth, provider)
  .then(() => {
   navigate("/home")
    
  })
  }




  return (
    <>
    <div className='regPage'>
      <div className='pageContentl'>
      <Image src={Logo}/>
      <h1 className='regHeading'>Welcome Login</h1>
      <p className='regP'>Stay updated on your professional world</p>
      
      <div className='inputBox'>
      
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
?<Button onClick={handleRegClick} className='regBtn' variant="contained">Sign In</Button>
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


     <Link to="/forget"><p className='forget'>Forgot password?</p></Link>
     <p className='loginPl'>New to LinkedIn ? <Link to="/"><span className='span'>Join now</span> </Link> </p>

<div className='fbgg'>
     
        <div onClick={handleGoogleLoging} className='googleFlex'>
          <FcGoogle/>
          <p>Login with Google</p>
        </div>
      
    
        <div onClick={handleGoogleLoging} className='googleFlex'>
          <BsFacebook className='fb'/>
          <p>Login with Facebook</p>
        </div>
    
      </div>
      
      </div>
      </div>
    </div>
  
  </>
  )
}

export default Login