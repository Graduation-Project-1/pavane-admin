import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import itemServices from '../../services/itemServices'
import Pagination from "react-js-pagination";
import './Items.scss'

export default function Items() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
  }

  async function getAllItemsHandler(currentPage) {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllItems(currentPage);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setItems(data.Data)
        setTotalResult(data.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllItemsHandler(currentPage)
  }, [currentPage])

  return <>
    <div className="items">
      <div className="row">
        <div className="col-md-12">
          <div className="add-item">
            <button
              className='add-item-btn'
              onClick={() => { navigate(`/items/addItem`) }}>
              Add Item
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
          <div className="item-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    items.map((item, index) => {
                      return (
                        <tr key={item._id} onClick={() => navigate(`/items/${item._id}`)}>
                          <td>{index + 1}</td>
                          <td className='name'>{item.name}</td>
                          <td>{item.gender}</td>
                          <td>{item.price}</td>
                          <td>{item.numberOfLikes}</td>
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
