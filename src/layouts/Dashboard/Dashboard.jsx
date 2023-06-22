import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Admins from '../../pages/Admins/Admins'
import AddAdmin from '../../pages/Admins/AddAdmin/AddAdmin'
import AdminDetails from '../../pages/Admins/AdminDetails/AdminDetails'
import EditAdmin from '../../pages/Admins/AdminDetails/EditAdmin/EditAdmin'
import Brands from '../../pages/Brands/Brands'
import AddBrand from '../../pages/Brands/AddBrand/AddBrand'
import BrandDetails from '../../pages/Brands/BrandDetails/BrandDetails'
import EditBrand from '../../pages/Brands/BrandDetails/EditBrand/EditBrand'
import Items from '../../pages/Items/Items'
import AddItem from '../../pages/Items/AddItem/AddItem'
import ItemDetails from '../../pages/Items/ItemDetails/ItemDetails'
import EditItem from '../../pages/Items/ItemDetails/EditItem/EditItem'
import Collections from '../../pages/Collections/Collections'
import AddCollection from '../../pages/Collections/AddCollection/AddCollection'
import CollectionDetails from '../../pages/Collections/CollectionDetails/CollectionDetails'
import EditCollection from '../../pages/Collections/CollectionDetails/EditCollection/EditCollection'
import Categories from '../../pages/Categories/Categories'
import AddCategory from '../../pages/Categories/AddCategory/AddCategory'
import CategoryDetails from '../../pages/Categories/CategoryDetails/CategoryDetails'
import EditCategory from '../../pages/Categories/CategoryDetails/EditCategory/EditCategory'
import Advertisements from '../../pages/Advertisements/Advertisements'
import AddAdvertisement from '../../pages/Advertisements/AddAdvertisement/AddAdvertisement'
import AdvertisementDetails from '../../pages/Advertisements/AdvertisementDetails/AdvertisementDetails'
import EditAdvertisement from '../../pages/Advertisements/AdvertisementDetails/EditAdvertisement/EditAdvertisement'
import Customers from '../../pages/Customers/Customers'
import AddCustomer from '../../pages/Customers/AddCustomer/AddCustomer'
import CustomerDetails from '../../pages/Customers/CustomerDetails/CustomerDetails'
import EditCustomer from '../../pages/Customers/CustomerDetails/EditCustomer/EditCustomer'
import Sale from '../../pages/Sale/Sale'
import AddSale from '../../pages/Sale/AddSale/AddSale'
import SaleDetails from '../../pages/Sale/SaleDetails/SaleDetails'
import EditSale from '../../pages/Sale/SaleDetails/EditSale/EditSale'

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
          <Route path='/admins/page/:pageNumber' element={<Admins />} />
          <Route path='/admins/:id' element={<AdminDetails />} />
          <Route path='/admins/page/:pageNumber/:id' element={<AdminDetails />} />
          <Route path='/admins/:id/edit' element={<EditAdmin />} />
          <Route path='/admins/page/:pageNumber/:id/edit' element={<EditAdmin />} />
          <Route path='/admins/addAdmin' element={<AddAdmin />} />

          <Route path='/brands' element={<Brands />} />
          <Route path='/brands/page/:pageNumber' element={<Brands />} />
          <Route path='/brands/:id' element={<BrandDetails />} />
          <Route path='/brands/page/:pageNumber/:id' element={<BrandDetails />} />
          <Route path='/brands/:id/edit' element={<EditBrand />} />
          <Route path='/brands/page/:pageNumber/:id/edit' element={<EditBrand />} />
          <Route path='/brands/addBrand' element={<AddBrand />} />

          <Route path='/items' element={<Items />} />
          <Route path='/items/page/:pageNumber' element={<Items />} />
          <Route path='/items/:id' element={<ItemDetails />} />
          <Route path='/items/page/:pageNumber/:id' element={<ItemDetails />} />
          <Route path='/items/:id/edit' element={<EditItem />} />
          <Route path='/items/page/:pageNumber/:id/edit' element={<EditItem />} />
          <Route path='/items/addItem' element={<AddItem />} />

          <Route path='/collections' element={<Collections />} />
          <Route path='/collections/page/:pageNumber' element={<Collections />} />
          <Route path='/collections/:id' element={<CollectionDetails />} />
          <Route path='/collections/page/:pageNumber/:id' element={<CollectionDetails />} />
          <Route path='/collections/:id/edit' element={<EditCollection />} />
          <Route path='/collections/page/:pageNumber/:id/edit' element={<EditCollection />} />
          <Route path='/collections/addCollection' element={<AddCollection />} />

          <Route path='/sale' element={<Sale />} />
          <Route path='/sale/page/:pageNumber' element={<Sale />} />
          <Route path='/sale/:id' element={<SaleDetails />} />
          <Route path='/sale/page/:pageNumber/:id' element={<SaleDetails />} />
          <Route path='/sale/:id/edit' element={<EditSale />} />
          <Route path='/sale/page/:pageNumber/:id/edit' element={<EditSale />} />
          <Route path='/sale/addSale' element={<AddSale />} />

          <Route path='/categories' element={<Categories />} />
          <Route path='/categories/page/:pageNumber' element={<Categories />} />
          <Route path='/categories/:id' element={<CategoryDetails />} />
          <Route path='/categories/page/:pageNumber/:id' element={<CategoryDetails />} />
          <Route path='/categories/page/:pageNumber/:id/edit' element={<EditCategory />} />
          <Route path='/categories/:id/edit' element={<EditCategory />} />
          <Route path='/categories/addCategory' element={<AddCategory />} />

          <Route path='/advertisements' element={<Advertisements />} />
          <Route path='/advertisements/:id' element={<AdvertisementDetails />} />
          <Route path='/advertisements/:id/edit' element={<EditAdvertisement />} />
          <Route path='/advertisements/addAdvertisement' element={<AddAdvertisement />} />

          <Route path='/customers' element={<Customers />} />
          <Route path='/customers/page/:pageNumber' element={<Customers />} />
          <Route path='/customers/:id' element={<CustomerDetails />} />
          <Route path='/customers/page/:pageNumber/:id' element={<CustomerDetails />} />
          <Route path='/customers/page/:pageNumber/:id/edit' element={<EditCustomer />} />
          <Route path='/customers/addCustomer' element={<AddCustomer />} />

          <Route path='/*' element={<Navigate replace to='/admins' />} />
        </Routes>
      </div>
    </div>
  </>
}
