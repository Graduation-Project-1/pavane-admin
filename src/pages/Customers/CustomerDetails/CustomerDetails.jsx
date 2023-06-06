import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import customerServices from '../../../services/customerServices'
import LikedBrands from './LikedBrands/LikedBrands'
import LikedCollections from './LikedCollections/LikedCollections'
import LikedItems from './LikedItems/LikedItems'
import WishList from './WishList/WishList'
import toastPopup from '../../../helpers/toastPopup'
import imageEndPoint from '../../../services/imagesEndPoint';
import './CustomerDetails.scss'

export default function CustomerDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [customer, setCustomer] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [isLikedBrands, setIsLikedBrands] = useState(true);
  const [isLikedCollections, setIsLikedCollections] = useState(false);
  const [isLikedItems, setIsLikedItems] = useState(false);
  const [isWishList, setIsWishList] = useState(false);

  async function getCustomerByIdHandler() {
    setLoading(true)
    try {
      const { data } = await customerServices.getCustomerById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCustomer(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteCustomerHandler() {
    setLoading(true)
    try {
      const { data } = await customerServices.deleteCustomer(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/customers/page/${params?.pageNumber}`)
        toastPopup.success("Customer deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function toggleIsLikedBrands() {
    setIsLikedBrands(true)
    setIsLikedCollections(false)
    setIsLikedItems(false)
    setIsWishList(false)
  }

  function toggleIsLikedCollections() {
    setIsLikedBrands(false)
    setIsLikedCollections(true)
    setIsLikedItems(false)
    setIsWishList(false)
  }

  function toggleIsLikedItems() {
    setIsLikedBrands(false)
    setIsLikedCollections(false)
    setIsLikedItems(true)
    setIsWishList(false)
  }

  function toggleIsWishlist() {
    setIsLikedBrands(false)
    setIsLikedCollections(false)
    setIsLikedItems(false)
    setIsWishList(true)
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await customerServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getCustomerByIdHandler()
      toastPopup.success("Customer added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await customerServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getCustomerByIdHandler()
      toastPopup.success("Customer removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getCustomerByIdHandler()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { deleteCustomerHandler() }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}
    {loading ? (<div className="overlay"><OverlayLoading /></div>) : (
      <div className="row">
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>
        <div>
          <button className='back' onClick={() => { navigate(`/customers/page/${params?.pageNumber}`) }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                customer?.image ?
                  customer?.image?.includes('https://') ?
                    customer?.image :
                    imageEndPoint + customer?.image :
                  `https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png`
              }
              alt="Customer Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/customers/page/${params?.pageNumber}/${params?.id}/edit`) }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    customer?.isArchived ? (
                      <button
                        className='edit btn btn-warning'
                        onClick={removeFromArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner spin"></i> : "Remove from Archive"}
                      </button>
                    ) : (
                      <button
                        className='edit btn btn-warning'
                        onClick={addToArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner spin"></i> : "Add to Archive"}
                      </button>
                    )
                  }
                  <button onClick={() => { setModalShow(true) }}
                    className='delete btn btn-danger'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <h2>{customer?.name}</h2>
            <p>Email: {customer?.email}</p>
            <p>Date of birth: {new Date(customer?.dateOfBirth).toDateString()}</p>
            <p>Phone: {customer?.phone}</p>
            <p>Gender: {customer?.gender}</p>
            <p>Location: {customer?.location}</p>
            <p>Account type: {customer?.accountType}</p>
            <p>Subscription ends in: {customer?.daysOfSubscription} days</p>
            <p>Referral link: {customer?.referralLink ? customer?.referralLink : "None"}</p>
            <p>Referral link usage: {customer?.referralLinkUsage}</p>
          </div>
        </div>
      </div>
    )}
    <div className="row">
      <div className="col-md-12">
        <div className="cats d-flex justify-content-center">
          <ul className="nav nav-tabs">
            {
              isLikedBrands ? (
                <li className="nav-item" onClick={() => { toggleIsLikedBrands() }}>
                  <a className="nav-link active" aria-current="page">Liked Brands</a>
                </li>
              ) : (
                <li className="nav-item" onClick={() => { toggleIsLikedBrands() }}>
                  <a className="nav-link" aria-current="page">Liked Brands</a>
                </li>
              )
            }
            {
              isLikedCollections ? (
                <li className="nav-item" onClick={() => { toggleIsLikedCollections() }}>
                  <a className="nav-link active">Liked Collections</a>
                </li>
              ) : (
                <li className="nav-item" onClick={() => { toggleIsLikedCollections() }}>
                  <a className="nav-link">Liked Collections</a>
                </li>
              )
            }
            {
              isLikedItems ? (
                <li className="nav-item" onClick={() => { toggleIsLikedItems() }}>
                  <a className="nav-link active">Liked Items</a>
                </li>
              ) : (
                <li className="nav-item" onClick={() => { toggleIsLikedItems() }}>
                  <a className="nav-link">Liked Items</a>
                </li>
              )
            }
            {
              isWishList ? (
                <li className="nav-item" onClick={() => { toggleIsWishlist() }}>
                  <a className="nav-link active">Wishlist</a>
                </li>
              ) : (
                <li className="nav-item" onClick={() => { toggleIsWishlist() }}>
                  <a className="nav-link">Wishlist</a>
                </li>
              )
            }
          </ul>
        </div>
      </div>

      <div className='mb-4'>
        {isLikedBrands &&
          (customer?.likedBrands?.length > 0 ? <LikedBrands customerData={customer} />
            : <p className='alert alert-warning text-center'>No liked brands</p>)}
      </div>

      <div className='mb-4'>
        {isLikedCollections &&
          (customer?.likedCollections?.length > 0 ? <LikedCollections customerData={customer} />
            : <p className='alert alert-warning text-center'>No liked collections</p>)}
      </div>

      <div className='mb-4'>
        {isLikedItems &&
          (customer?.likedItems?.length > 0 ? <LikedItems customerData={customer} />
            : <p className='alert alert-warning text-center'>No liked items</p>)}
      </div>

      <div className='mb-4'>
        {isWishList &&
          (customer?.wishList?.length > 0 ? <WishList customerData={customer} />
            : <p className='alert alert-warning text-center'>Wishlist is empty</p>)}
      </div>
    </div>
  </>
}
