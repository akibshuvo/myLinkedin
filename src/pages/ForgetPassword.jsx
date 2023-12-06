import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgetPassword = () => {
    const auth = getAuth();
    let navigate = useNavigate()

    let [email,setEmail] = useState("")

    let handleChange = (e)=>{
        setEmail(
            e.target.value
         )
    }

    let handleCancel = ()=>{
        navigate("/login")
    }

    let handleForget = ()=>{
      
        
            sendPasswordResetEmail(auth, email).then(() => {
                
                toast.success('Check your email', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    }); 
                    navigate("/login")
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode.includes('email')){
            toast.error('Email not found', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                }); 
        }
     
      });

        

    }




  return (
    <>
<div className='forgetBox'>
    <div className='fContent'>
        <h1 className='forgetHeading'>Forget Password</h1>
        <p className='forgetP'>Please enter your email address or mobile number to search for your account.</p>
        <TextField onChange={handleChange} className='inputsf' id="outlined-basic" label="Enter Your Email" variant="outlined" />
        
        <div className='fbtn'>
        <Button onClick={handleCancel}  variant="outlined">Cancel</Button>
        <Button onClick={handleForget} className='forgetBtn' variant="contained">Forget</Button>
        </div>
    </div>
</div>
    </>
  )
}

export default ForgetPassword