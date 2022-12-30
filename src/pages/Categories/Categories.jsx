import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../services/categoryServices'
import Pagination from "react-js-pagination";
import './Categories.scss'

export default function Categories() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
  }

  async function getAllCategoriesHandler(currentPage) {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(currentPage);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCategories(data.Data)
        setTotalResult(data.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function deleteCategoryHandler(id) {
    setLoading(true)
    try {
      const { data } = await categoryServices.deleteCategory(id)
      setLoading(true)
      if (data.success && data.status === 200) {
        // setModalShow(false)
        setLoading(false);
        // navigate(`/categories`)
        getAllCategoriesHandler(currentPage)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler(currentPage)
  }, [currentPage])

  return <>
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
                    categories.map((category, index) => {
                      return (
                        <tr key={category._id} onClick={() => navigate(`/categories/${category._id}`)}>
                          <td>{index + 1}</td>
                          <td className='name'>{category.name}</td>
                          <td className='btn-danger' onClick={(e) => {e.stopPropagation() ;deleteCategoryHandler(category._id)}}>Remove</td>
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
