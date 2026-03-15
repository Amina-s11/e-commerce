import React, {useState} from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import Cart from '../../Pages/Cart'

const Navbar = () => {

  const [menu,setMenu] = useState("shop");
  // line 9 and 18 to 21 is writen for when you click on shop the red underline should show under shop and for men it should show under men
  return (
    <div className= 'navbar'>
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>FashioNext</p>
      </div>
      <ul className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link style={{ textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}><Link style={{ textDecoration: 'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}><Link style={{ textDecoration: 'none'}} to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{ textDecoration: 'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
      <Link to='/login'><button>Login</button></Link>
      <Link to='/cart'><img src={cart_icon} alt=""/></Link>
      <div className="nav-cart-count">0</div>
      </div>
    </div>
  )
}


export default Navbar
