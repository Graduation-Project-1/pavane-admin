import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Brands.scss'

export default function Brands() {

  const navigate = useNavigate()

  return <>
    <div className="brands">
      <div className="row">
        <div className="col-md-12">
          <div className="add-brand">
            <button
              className='add-brand-btn'
              onClick={() => { navigate(`/brands/addBrand`) }}>
              Add Brand
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="brand-data">
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
