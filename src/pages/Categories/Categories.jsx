import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../services/categoryServices'
import Pagination from "react-js-pagination";
import toastPopup from '../../helpers/toastPopup';
import './Categories.scss'

export default function Categories() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [modalShow, setModalShow] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/categories/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setHidePagination(false)
        setCategories(data?.Data)
        setTotalResult(data?.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchCategoryByName(searchValue) {
    try {
      const { data } = await categoryServices.categorySearch(searchValue)
      if (data.success && data.status === 200) {
        setCategories(data?.Data)
        setTotalResult(data?.totalResult)
        setHidePagination(true)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteCategoryHandler(id) {
    setLoading(true)
    try {
      const { data } = await categoryServices.deleteCategory(id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        setHidePagination(false)
        navigate(`/categories/page/${params?.pageNumber}`)
        getAllCategoriesHandler(currentPage)
        toastPopup.success("Category deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchCategoryByName(searchValue)
    } else {
      getAllCategoriesHandler(params?.pageNumber)
    }
  }, [searchValue])

  return <>

    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { deleteCategoryHandler(currentCategory) }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}

    <div className="categories">
      <div className="row">
        <div className="col-md-12">
          <div className="add-category">
            <button
              className='add-category-btn'
              onClick={() => { navigate(`/categories/addCategory`) }}>
              Add Category
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
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>
        <div className="col-md-12">
          <div className="category-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    categories?.map((category, index) => {
                      return (
                        <tr key={category?._id}
                          onClick={() => navigate(`/categories/page/${params?.pageNumber ? params?.pageNumber : 1}/${category?._id}`)}>
                          <td>{index + 1}</td>
                          <td className='name'>{category?.name}</td>
                          <td>
                            <button
                              className='btn btn-danger'
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalShow(true);
                                setCurrentCategory(category?._id)
                              }}>Remove</button>
                          </td>
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
