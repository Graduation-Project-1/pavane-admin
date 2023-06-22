import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import adminImage from '../../../assets/image.jpg'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading';
import adminServices from '../../../services/adminServices';
import toastPopup from '../../../helpers/toastPopup';
import Pagination from 'react-js-pagination';
import './AdminDetails.scss'

export default function AdminDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState({})
  const [admins, setAdmins] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [totalResult, setTotalResult] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  function handlePageChange(pageNumber = 1) {
    setCurrentPage(pageNumber)
    navigate(`/admins/${admins[pageNumber - 1]?._id}`)
    getAdminByIdHandler(admins[pageNumber - 1]?._id)
  }

  async function getAdminByIdHandler(id = params?.id) {
    setLoading(true)
    try {
      const { data } = await adminServices.getAdminById(id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setAdmin(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllAdminsHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.getAllAdmins(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setAdmins(data?.Data)
        setTotalResult(data?.totalResult)
        setCurrentPage(data?.Data?.findIndex(obj => obj?._id === params?.id) + 1)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteAdminHandler() {
    let nextAdmin = admins[currentPage]?._id;
    let firstAdmin = admins[0]?._id;
    setLoading(true)
    try {
      const { data } = await adminServices.deleteAdmin(params?.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        if (admins?.length === 1) {
          navigate(`/admins`)
        } else if (currentPage === admins?.length) {
          navigate(`/admins/${firstAdmin}`)
          getAdminByIdHandler(firstAdmin)
          getAllAdminsHandler()
        } else {
          navigate(`/admins/${nextAdmin}`)
          getAdminByIdHandler(nextAdmin)
          getAllAdminsHandler()
        }
        navigate(`/admins`)
        toastPopup.success("Admin deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAdminByIdHandler()
    getAllAdminsHandler()
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
        <div>
          <button className='back' onClick={() => {
            params?.pageNumber ?
              navigate(`/admins/page/${params?.pageNumber}`)
              : navigate(`/admins`)
          }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img src={adminImage} alt="Admin Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => {
                    params?.pageNumber ?
                      navigate(`/admins/page/${params?.pageNumber}/${params?.id}/edit`)
                      : navigate(`/admins/${params?.id}/edit`)
                  }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{admin?.name}</h2>
            <p>Admin Email: {admin?.email}</p>
            <p>Admin Role: {admin?.role}</p>
          </div>
        </div>
        <div className='pagination-nav'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={1}
            totalItemsCount={totalResult}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    )}
  </>
}
