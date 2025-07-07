import React from 'react'
import Login from "../components/Login/Login.jsx";

const LoginPage = ({autoclose,setActive}) => {
  return (
    <div>
      <Login autoclose={autoclose} setActive={setActive}/>
    </div>
  )
}

export default LoginPage;
