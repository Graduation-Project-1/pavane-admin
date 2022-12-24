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
import AdminDetails from '../../pages/Admins/AdminDetails/AdminDetails'
import EditAdmin from '../../pages/Admins/AdminDetails/EditAdmin/EditAdmin'
import AddCategory from '../../pages/Categories/AddCategory/AddCategory'
import CategoryDetails from '../../pages/Categories/CategoryDetails/CategoryDetails'
import EditCategory from '../../pages/Categories/CategoryDetails/EditCategory/EditCategory'
import BrandDetails from '../../pages/Brands/BrandDetails/BrandDetails'
import EditBrand from '../../pages/Brands/BrandDetails/EditBrand/EditBrand'
import AddProduct from '../../pages/Products/AddProduct/AddProduct'
import ProductDetails from '../../pages/Products/ProductDetails/ProductDetails'
import AddCollection from '../../pages/Collections/AddCollection/AddCollection'
import CollectionDetails from '../../pages/Collections/CollectionDetails/CollectionDetails'
import AddCustomer from '../../pages/Customers/AddCustomer/AddCustomer'
import CustomerDetails from '../../pages/Customers/CustomerDetails/CustomerDetails'
import EditProduct from '../../pages/Products/ProductDetails/EditProduct/EditProduct'
import AddAdvertisement from '../../pages/Advertisements/AddAdvertisement/AddAdvertisement'
import AdvertisementDetails from '../../pages/Advertisements/AdvertisementDetails/AdvertisementDetails'
import EditAdvertisement from '../../pages/Advertisements/AdvertisementDetails/EditAdvertisement/EditAdvertisement'
import EditCustomer from '../../pages/Customers/CustomerDetails/EditCustomer/EditCustomer'
import EditCollection from '../../pages/Collections/CollectionDetails/EditCollection/EditCollection'

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
          <Route path='/admins/:id' element={<AdminDetails />} />
          <Route path='/admins/:id/edit' element={<EditAdmin />} />
          <Route path='/admins/addAdmin' element={<AddAdmin />} />

          <Route path='/brands' element={<Brands />} />
          <Route path='/brands/:id' element={<BrandDetails />} />
          <Route path='/brands/:id/edit' element={<EditBrand />} />
          <Route path='/brands/addBrand' element={<AddBrand />} />

          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/products/:id/edit' element={<EditProduct />} />
          <Route path='/products/addProduct' element={<AddProduct />} />

          <Route path='/collections' element={<Collections />} />
          <Route path='/collections/:id' element={<CollectionDetails />} />
          <Route path='/collections/:id/edit' element={<EditCollection />} />
          <Route path='/collections/addCollection' element={<AddCollection />} />

          <Route path='/categories' element={<Categories />} />
          <Route path='/categories/:id' element={<CategoryDetails />} />
          <Route path='/categories/:id/edit' element={<EditCategory />} />
          <Route path='/categories/addCategory' element={<AddCategory />} />

          <Route path='/advertisements' element={<Advertisements />} />
          <Route path='/advertisements/:id' element={<AdvertisementDetails />} />
          <Route path='/advertisements/:id/edit' element={<EditAdvertisement />} />
          <Route path='/advertisements/addAdvertisement' element={<AddAdvertisement />} />

          <Route path='/customers' element={<Customers />} />
          <Route path='/customers/:id' element={<CustomerDetails />} />
          <Route path='/customers/:id/edit' element={<EditCustomer />} />
          <Route path='/customers/addCustomer' element={<AddCustomer />} />

          <Route path='/*' element={<Navigate replace to='/admins' />} />
        </Routes>
      </div>
    </div>
  </>
}
