import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Admins.scss'

export default function Admins() {

  const navigate = useNavigate()

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
        <div className="col-md-12">
          <div className="admin-data">
            <table class="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Ahmed</td>
                  <td>Ahmed@gmail.com</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Ahmed</td>
                  <td>Ahmed@gmail.com</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Ahmed</td>
                  <td>Ahmed@gmail.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
}
