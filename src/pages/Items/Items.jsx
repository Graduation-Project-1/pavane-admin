import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import itemServices from '../../services/itemServices'
import Pagination from "react-js-pagination";
import './Items.scss'

export default function Items() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/items/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllItemsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllItems(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setHidePagination(false)
        setItems(data?.Data)
        setTotalResult(data?.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchItemByName(searchValue) {
    try {
      const { data } = await itemServices.itemSearch(searchValue)
      setItems(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function topItemsHandler() {
    try {
      const { data } = await itemServices.getMostLikedItems()
      setItems(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function archivedItemsHandler() {
    try {
      const { data } = await itemServices.getArchivedItems()
      setItems(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllItemsHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchItemByName(searchValue)
    } else {
      getAllItemsHandler(params?.pageNumber)
    }
  }, [searchValue])

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

      <div className="form-search">
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          className='form-control w-50'
          type="text"
          name="search"
          id="search"
          placeholder='Search...'
        />
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="filter-items">
            <div className="items">
              <div>
                <input
                  defaultChecked
                  value="all"
                  onClick={getAllItemsHandler}
                  type="radio"
                  name="filter"
                  id="all"
                />
                <label htmlFor="all">All</label>
              </div>

              <div>
                <input
                  value="top_items"
                  onClick={topItemsHandler}
                  type="radio"
                  name="filter"
                  id="top_items"
                />
                <label htmlFor="top_items">Top Items</label>
              </div>

              <div>
                <input
                  value="archived"
                  onClick={archivedItemsHandler}
                  type="radio"
                  name="filter"
                  id="archived"
                />
                <label htmlFor="archived">Archived</label>
              </div>
            </div>
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
                        <tr key={item?._id} onClick={() => navigate(`/items/page/${params?.pageNumber ? params?.pageNumber : 1}/${item?._id}`)}>
                          <td>{index + 1}</td>
                          <td className='name'>{item?.name}</td>
                          <td>{item?.gender}</td>
                          <td>{item?.price}</td>
                          <td>{item?.numberOfLikes}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {!hidePagination && <div className='pagination-nav'>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={postPerPage}
          totalItemsCount={totalResult}
          pageRangeDisplayed={10}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>}
    </div>
  </>
}
