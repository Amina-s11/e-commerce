// import React from 'react'
// import './Admin.css'
// import Sidebar from '../../Components/Sidebar/Sidebar'
// import Navbar from '../../Components/Navbar/Navbar'
// import { Routes, Route } from 'react-router-dom'
// import AddProduct from '../../Components/AddProduct/AddProduct'
// import ListProduct from '../../Components/ListProduct/ListProduct'
// import Users from '../../Components/Users/Users'


// const Admin = () => {
//   return (
//     <div className='admin'>
//       <Navbar/>
//       <Sidebar/>

//       <div className="admin-content">

//         <Routes>
//           <Route path='addproduct' element={<AddProduct/>}/>
//           <Route path='listproduct' element={<ListProduct/>}/>
//           <Route path='users' element={<Users/>}/>
//         </Routes>

//       </div>

//     </div>
//   )
// }

// export default Admin

// import React from 'react'
// import Navbar from '../../Components/Navbar/Navbar'
// import Sidebar from '../../Components/Sidebar/Sidebar'

// const Admin = () => {
//   return (
//     <div className="admin">
//       <Navbar />
//       <Sidebar />
//     </div>
//   )
// }

// export default Admin

import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div className="admin">
      <Navbar />
      
      <div style={{ display: "flex", height: "100vh" }}>

        <Sidebar />

        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default Admin