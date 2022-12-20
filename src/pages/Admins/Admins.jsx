import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import adminServices from '../../services/adminServices'
import './Admins.scss'

export default function Admins() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllAdminsHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.getAllAdmins();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setAdmins(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllAdminsHandler()
  }, [])

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
                        <tr key={admin._id} onClick={() => navigate(`/admins/${admin._id}`)}>
                          <td>{index + 1}</td>
                          <td>{admin.name}</td>
                          <td>{admin.email}</td>
                          <td>{admin.role}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
}
