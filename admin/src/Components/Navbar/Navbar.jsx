import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navlogo">
        <img src={logo} alt="" className="navlogo" />
            <div className="text">
              <h1>FASHIONEXT</h1>
              <p>Admin Panel</p>
            </div>
      </div>
            <img src={navProfile} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar
