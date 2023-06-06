import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../../services/categoryServices'
import imageEndPoint from '../../../services/imagesEndPoint'
import toastPopup from '../../../helpers/toastPopup'
import Pagination from 'react-js-pagination'
import itemServices from '../../../services/itemServices'
import InfiniteScroll from 'react-infinite-scroll-component'
import './CategoryDetails.scss'

export default function CategoryDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingAllCategories, setLoadingAllCategories] = useState(false)
  const [category, setCategory] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [totalResult, setTotalResult] = useState(0)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryItems, setCategoryItems] = useState([])
  const [totalCategoryItems, setTotalCategoryItems] = useState(0)

  let PAGE_NUMBER = parseInt(Math.ceil(categoryItems?.length / 10) + 1)
  let LIMIT = 10

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
    navigate(`/categories/${categories[pageNumber - 1]?._id}`)
    getCategoryByIdHandler(categories[pageNumber - 1]?._id)
    getCategoryItemsHandler(categories[pageNumber - 1]?._id)
    getAllCategoryItems(categories[pageNumber - 1]?._id)
  }

  async function getCategoryByIdHandler(id = params?.id) {
    setLoading(true)
    try {
      const { data } = await categoryServices.getCategoryById(id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategory(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getCategoryItemsHandler(id = params?.id, page = 1, limit = 10) {
    try {
      const { data } = await itemServices.getCategoryItems(id, page, limit);
      if (data?.success && data?.status === 200) {
        let mergeData = [...categoryItems, ...data?.Data]
        setCategoryItems(mergeData)
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllCategoryItems(id = params?.id) {
    setLoadingAllCategories(true)
    try {
      const { data } = await itemServices.getCategoryItems(id, 1, 10000);
      setLoadingAllCategories(false)
      setTotalCategoryItems(data?.totalResult)
      setCategoryItems([])
    } catch (e) {
      setLoadingAllCategories(false)
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategories(data?.Data)
        setTotalResult(data?.totalResult)
        setCurrentPage(data?.Data?.findIndex(obj => obj?._id === params?.id) + 1)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteCategoryHandler() {
    let nextCategory = categories[currentPage]?._id;
    let firstCategory = categories[0]?._id;
    setLoading(true)
    try {
      const { data } = await categoryServices.deleteCategory(params?.id)
      setLoading(true)
      setModalShow(false)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        if (currentPage === categories?.length) {
          navigate(`/categories/${firstCategory}`)
          getCategoryByIdHandler(firstCategory)
          getAllCategoryItems(firstCategory)
          getCategoryItemsHandler(firstCategory)
          getAllCategoriesHandler()
        } else {
          navigate(`/categories/${nextCategory}`)
          getCategoryByIdHandler(nextCategory)
          getAllCategoryItems(nextCategory)
          getCategoryItemsHandler(nextCategory)
          getAllCategoriesHandler()
        }
        toastPopup.success("Category deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function fetchMoreData() {
    if (categoryItems?.length < totalCategoryItems) {
      getCategoryItemsHandler(params?.id, PAGE_NUMBER, LIMIT)
    }
  }

  useEffect(() => {
    getCategoryByIdHandler()
    getAllCategoriesHandler()
    getCategoryItemsHandler()
    getAllCategoryItems()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { deleteCategoryHandler() }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}

    {loading ? (<div className="overlay"><OverlayLoading /></div>) : (
      <div className="row cat-page">
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>

        <div>
          <button className='back' onClick={() => {
            params?.pageNumber ?
              navigate(`/categories/page/${params?.pageNumber}`)
              : navigate(`/categories`)
          }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                category?.image ?
                  category?.image?.includes('https://') ?
                    category?.image :
                    `${imageEndPoint}${category?.image}`
                  : "https://resources.workable.com/wp-content/uploads/2016/01/category-manager-640x230.jpg"
              }
              alt="Category Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => {
                    params?.pageNumber ?
                      navigate(`/categories/page/${params?.pageNumber}/${params?.id}/edit`)
                      : navigate(`/categories/${params?.id}/edit`)
                  }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  <button onClick={() => { setModalShow(true) }}
                    className='delete btn btn-danger'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <h2>{category?.name}</h2>
            <p><span>Number of items:</span> {loadingAllCategories ? <i className="fas fa-spinner fa-spin "></i> : totalCategoryItems}</p>
          </div>
        </div>

        <div className='pagination-nav'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={1}
            totalItemsCount={totalResult}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>

        <div className='cat-items-style'><p>Category Items</p></div>
        <InfiniteScroll
          dataLength={categoryItems?.length}
          next={fetchMoreData}
          hasMore={categoryItems?.length < totalCategoryItems}
          loader={<h4 className='loading-infinity-scroll'><i className="spinner-border"></i></h4>}
          endMessage={
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="row">
            {
              categoryItems.map((item) => {
                return (
                  <div className="col-md-3" key={item?._id}>
                    <div className="item" onClick={() => navigate(`/items/${item?._id}`)}>
                      <div className="image">
                        <img src={item?.images?.[0]?.includes('https://') ?
                          item?.images?.[0] :
                          `${imageEndPoint}${item?.images?.[0]}`}
                          alt="Item Image" />
                      </div>
                      <div className="item-info">
                        <h3>{item?.name?.slice(0, 10)}</h3>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </InfiniteScroll>
      </div>
    )}
  </>
}
