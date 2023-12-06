import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";

import Reg from "./pages/Reg";
import Login from "./pages/Login"
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home"
import Friends from "./pages/Friends";
import Post from "./pages/Post";
import Mgs from "./pages/Mgs";
import { ToastContainer } from 'react-toastify';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route>  
    <Route path="/" element={<Reg />} /> 
    <Route path="login" element={<Login />} /> 
    <Route path="/home" element={<Home />} /> 
    <Route path="/forget" element={<ForgetPassword />} /> 
    <Route path="/friends" element={<Friends />} /> 
    <Route path="/post" element={<Post />} /> 
    <Route path="/mgs" element={<Mgs />} /> 
      </Route>
   
  )
  )


  return (
    <>
    <RouterProvider router={router}/>
    <ToastContainer/>
     
    </>
  )
}

export default App
