import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Admins from '../../pages/Admins/Admins'
import Brands from '../../pages/Brands/Brands'
import Products from '../../pages/Products/Products'
import Collections from '../../pages/Collections/Collections'
import Categories from '../../pages/Categories/Categories'
import Advertisements from '../../pages/Advertisements/Advertisements'
import Customers from '../../pages/Customers/Customers'
import AddAdmin from '../../pages/Admins/AddAdmin/AddAdmin'
import AddBrand from '../../pages/Brands/AddBrand/AddBrand'

export default function Dashboard() {
  return <>
    <div className="row">
      <div className="col-md-12">
        <Navbar />
      </div>
    </div>
    <div className='row'>
      <div className='col-md-2'>
        <Sidebar />
      </div>
      <div className="col-md-10">
        <Routes>
          <Route path='/' element={<Navigate replace to='/admins' />} />
          <Route path='/admins' element={<Admins />} />
          <Route path='/admins/addAdmin' element={<AddAdmin />} />

          <Route path='/brands' element={<Brands />} />
          <Route path='/brands/addBrand' element={<AddBrand />} />

          <Route path='/products' element={<Products />} />
          <Route path='/collections' element={<Collections />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/advertisements' element={<Advertisements />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/*' element={<Navigate replace to='/admins' />} />
        </Routes>
      </div>
    </div>
  </>
}
