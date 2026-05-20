// import React from 'react'
// import { Routes, Route } from 'react-router-dom'

// import AdminLogin from './Pages/AdminLogin'
// import Admin from './Pages/Admin/Admin'

// const App = () => {
//   return (

//     <Routes>

//       <Route path='/' element={<AdminLogin/>}/>

//       <Route path='/admin/*' element={<Admin/>}/>

//     </Routes>

//   )
// }

// export default App

// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'

// import AdminLogin from './Pages/AdminLogin'
// import Admin from './Pages/Admin/Admin'

// import AddProduct from './Components/AddProduct/AddProduct'
// import ListProduct from './Components/ListProduct/ListProduct'
// import Users from './Components/Users/Users'

// const App = () => {
//   return (
//     <Routes>

//       <Route path='/' element={<AdminLogin />} />

//       <Route path='/admin' element={<Admin />}>

//         {/* IMPORTANT FIX */}
//         <Route index element={<Navigate to="addproduct" replace />} />

//         <Route path='addproduct' element={<AddProduct />} />
//         <Route path='listproduct' element={<ListProduct />} />
//         <Route path='users' element={<Users />} />

//       </Route>

//     </Routes>
//   )
// }

// export default App

// import React from 'react'
// import { Routes, Route } from 'react-router-dom'

// import AdminLogin from './Pages/AdminLogin'
// import Admin from './Pages/Admin/Admin'

// import AddProduct from './Components/AddProduct/AddProduct'
// import ListProduct from './Components/ListProduct/ListProduct'
// import Users from './Components/Users/Users'

// const App = () => {
//   return (
//     <Routes>

//       <Route path='/' element={<AdminLogin />} />

//       {/* ADMIN LAYOUT */}
//       <Route path='/admin' element={<Admin />} />

//       {/* ADMIN PAGES (FLAT ROUTES) */}
//       <Route path='/admin/addproduct' element={<AddProduct />} />
//       <Route path='/admin/listproduct' element={<ListProduct />} />
//       <Route path='/admin/users' element={<Users />} />

//     </Routes>
//   )
// }

// export default App

// import React from 'react'
// import { Routes, Route } from 'react-router-dom'

// import AdminLogin from './Pages/AdminLogin'
// import Admin from './Pages/Admin/Admin'

// import AddProduct from './Components/AddProduct/AddProduct'
// import ListProduct from './Components/ListProduct/ListProduct'
// import Users from './Components/Users/Users'

// const App = () => {
//   return (
//     <Routes>

//       <Route path='/' element={<AdminLogin />} />

//       <Route path='/admin' element={<Admin />} />

//       <Route path='/admin/addproduct' element={<AddProduct />} />

//       <Route path='/admin/listproduct' element={<ListProduct />} />

//       <Route path='/admin/users' element={<Users />} />

//     </Routes>
//   )
// }

// export default App

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import AdminLogin from './Pages/AdminLogin'
import Admin from './Pages/Admin/Admin'

import AddProduct from './Components/AddProduct/AddProduct'
import ListProduct from './Components/ListProduct/ListProduct'
import Users from './Components/Users/Users'

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<AdminLogin />} />

      {/* ADMIN LAYOUT */}
      <Route path='/admin' element={<Admin />}>

        {/* default page */}
        <Route index element={<Navigate to="addproduct" replace />} />

        <Route path='addproduct' element={<AddProduct />} />
        <Route path='listproduct' element={<ListProduct />} />
        <Route path='users' element={<Users />} />

      </Route>

    </Routes>
  )
}

export default App