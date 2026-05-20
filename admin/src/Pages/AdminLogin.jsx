import React, { useState } from 'react'
import './AdminLogin.css'
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const handleLogin = async() => {

    let responseData;

    await fetch('http://localhost:4000/admin-login',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    .then((response)=>response.json())
    .then((data)=>responseData=data)

    if(responseData.success){

      localStorage.setItem('admin-auth','true');
      navigate('/admin');

    }
    else{
      alert(responseData.message)
    }

  }

  return (
    <div className='admin-login'>

      <div className="admin-login-container">

        <h1>Admin Login</h1>

        <input
          type="email"
          placeholder='Admin Email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  )
}

export default AdminLogin