import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import Pagination from "react-js-pagination";
import adminServices from '../../services/adminServices'
import './Admins.scss'

export default function Admins() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    navigate(`/admins/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllAdminsHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.getAllAdmins(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setAdmins(data?.Data)
        setTotalResult(data?.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllAdminsHandler(params?.pageNumber)
  }, [params?.pageNumber])

  return <>
    <div className="admins">
      <div className="row">
        <div className="col-md-12">
          <div className="add-admin">
            <button
              className='add-admin-btn'
              onClick={() => { navigate(`/admins/addAdmin`) }}>
              Add Admin
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>
        <div className="col-md-12">
          <div className="admin-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    admins.map((admin, index) => {
                      return (
                        <tr key={admin?._id}

                          onClick={() => navigate(`/admins/page/${params?.pageNumber ? params?.pageNumber : 1}/${admin?._id}`)}>
                          <td>{index + 1}</td>
                          <td>{admin?.name}</td>
                          <td>{admin?.email}</td>
                          <td>{admin?.role}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='pagination-nav'>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={postPerPage}
          totalItemsCount={totalResult}
          pageRangeDisplayed={10}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  </>
}
