import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import adminImage from '../../../assets/image.jpg'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading';
import adminServices from '../../../services/adminServices';
import './AdminDetails.scss'

export default function AdminDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getAdminByIdHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.getAdminById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setAdmin(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function deleteAdminHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.deleteAdmin(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/admins`)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAdminByIdHandler()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { deleteAdminHandler() }} className='delete btn btn-danger w-50'>Delete</div>
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
            <img src={adminImage} alt="" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/admins/${params.id}/edit`) }} className='edit btn btn-warning'>Edit</button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{admin.name}</h2>
            <p>Admin Email: {admin.email}</p>
            <p>Admin Role: {admin.role}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
