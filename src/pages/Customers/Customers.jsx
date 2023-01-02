import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import customerServices from '../../services/customerServices'
import Pagination from "react-js-pagination";
import './Customers.scss'

export default function Customers() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
  }

  async function getAllCustomersHandler(currentPage) {
    setLoading(true)
    try {
      const { data } = await customerServices.getAllCustomers(currentPage);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCustomers(data.Data)
        setTotalResult(data.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllCustomersHandler(currentPage)
  }, [currentPage])

  return <>
    <div className="customers">
      <div className="row">
        <div className="col-md-12">
          <div className="add-customer">
            <button
              className='add-customer-btn'
              onClick={() => { navigate(`/customers/addCustomer`) }}>
              Add Customer
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
          <div className="customer-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    customers.map((customer, index) => {
                      return (
                        <tr key={customer._id}
                          onClick={() => navigate(`/customers/${customer._id}`)}>
                          <td>{index + 1}</td>
                          <td>{customer.name}</td>
                          <td>{customer.email}</td>
                          <td>{customer.phone}</td>
                          <td>{customer.gender}</td>
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
