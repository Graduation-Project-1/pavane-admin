import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import customerServices from '../../../services/customerServices'
import './CustomerDetails.scss'

export default function CustomerDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getCustomerByIdHandler() {
    setLoading(true)
    try {
      const { data } = await customerServices.getUserById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCustomer(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function deleteCustomerHandler() {
    setLoading(true)
    try {
      const { data } = await customerServices.deleteUser(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/customers`)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
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
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { deleteCustomerHandler() }} className='delete btn btn-danger w-50'>Delete</div>
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
        <div className="col-md-4">
          <div className="image">
            <img src={customer.image} alt="Customer Cover" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="product-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/customers/${params.id}/edit`) }} className='edit btn btn-warning'>Edit</button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{customer.name}</h2>
            <p>Customer Email: {customer.email}</p>
            <p>Customer Date of Birth: {new Date(customer.dateOfBirth).toDateString()}</p>
            <p>Phone: {customer.phone}</p>
            <p>Gender: {customer.gender}</p>
            <p>Location: {customer.location}</p>
            <p>Referral Link: {customer.numberOfPeopleUseReferralLink}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
