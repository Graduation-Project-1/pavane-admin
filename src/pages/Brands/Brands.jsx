import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import Pagination from "react-js-pagination";
import brandServices from '../../services/brandServices'
import './Brands.scss'

export default function Brands() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/brands/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllBrandsHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getAllBrands(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setHidePagination(false)
        setBrands(data?.Data)
        setTotalResult(data?.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchBrandByName(searchValue) {
    try {
      const { data } = await brandServices.brandSearch(searchValue)
      setBrands(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function topBrandsHandler() {
    try {
      const { data } = await brandServices.getMostLikedBrands()
      setBrands(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllBrandsHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchBrandByName(searchValue)
    } else {
      getAllBrandsHandler(params?.pageNumber)
    }
  }, [searchValue])

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
                  onClick={getAllBrandsHandler}
                  type="radio"
                  name="filter"
                  id="all"
                />
                <label htmlFor="all">All</label>
              </div>

              <div>
                <input
                  value="top_items"
                  onClick={topBrandsHandler}
                  type="radio"
                  name="filter"
                  id="top_items"
                />
                <label htmlFor="top_items">Top Brands</label>
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
          <div className="brand-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    brands.map((brand, index) => {
                      return (
                        <tr key={brand?._id} onClick={() => navigate(`/brands/page/${params?.pageNumber ? params?.pageNumber : 1}/${brand?._id}`)}>
                          <td>{index + 1}</td>
                          <td>{brand?.name}</td>
                          <td>{brand?.email}</td>
                          <td>{brand?.phone}</td>
                          <td>{brand?.numberOfLikes}</td>
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
