import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../../services/brandServices'
import itemServices from '../../../services/itemServices'
import toastPopup from '../../../helpers/toastPopup'
import Pagination from 'react-js-pagination'
import imageEndPoint from '../../../services/imagesEndPoint'
import InfiniteScroll from 'react-infinite-scroll-component'
import './BrandDetails.scss'

export default function BrandDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingAllItems, setLoadingAllItems] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [brand, setBrand] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [brandItems, setBrandItems] = useState([])
  const [totalResult, setTotalResult] = useState(0)
  const [totalBrandItems, setTotalBrandItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [brands, setBrands] = useState([])

  let PAGE_NUMBER = parseInt(Math.ceil(brandItems?.length / 10) + 1)
  let LIMIT = 10

  function handlePageChange(pageNumber = 1) {
    setCurrentPage(pageNumber)
    navigate(`/brands/${brands[pageNumber - 1]?._id}`)
    getBrandByIdHandler(brands[pageNumber - 1]?._id)
    getBrandItemsHandler(brands[pageNumber - 1]?._id)
    getAllBrandItems(brands[pageNumber - 1]?._id)
  }

  async function getBrandByIdHandler(id = params?.id) {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById(id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setBrand(data?.Data)
        setCategories(data?.Data?.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getBrandItemsHandler(id = params?.id, page = 1, limit = 10) {
    try {
      const { data } = await itemServices.getBrandItems(id, page, limit);
      if (data?.success && data?.status === 200) {
        let mergeData = [...brandItems, ...data?.Data]
        setBrandItems(mergeData)
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllBrandItems(id = params?.id) {
    setLoadingAllItems(true)
    try {
      const { data } = await itemServices.getBrandItems(id, 1, 10000);
      setTotalBrandItems(data?.totalResult)
      setLoadingAllItems(false)
      setBrandItems([])
    } catch (e) {
      setLoadingAllItems(false)
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllBrandsHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getAllBrands(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setBrands(data?.Data)
        setTotalResult(data?.totalResult)
        setCurrentPage(data?.Data?.findIndex(obj => obj?._id === params?.id) + 1)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteBrandHandler() {
    let nextBrand = brands[currentPage]?._id;
    let firstBrand = brands[0]?._id;
    setLoading(true)
    try {
      const { data } = await brandServices.deleteBrand(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        if (currentPage === brands?.length) {
          navigate(`/brands/${firstBrand}`)
          getBrandByIdHandler(firstBrand)
          getAllBrandItems(firstBrand)
          getBrandItemsHandler(firstBrand)
          getAllBrandsHandler()
        } else {
          navigate(`/brands/${nextBrand}`)
          getAllBrandItems(nextBrand)
          getBrandByIdHandler(nextBrand)
          getBrandItemsHandler(nextBrand)
          getAllBrandsHandler()
        }
        toastPopup.success("Brand deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await brandServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getBrandByIdHandler()
      toastPopup.success("Brand added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await brandServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getBrandByIdHandler()
      toastPopup.success("Brand removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function fetchMoreData() {
    if (brandItems?.length < totalBrandItems) {
      getBrandItemsHandler(params?.id, PAGE_NUMBER, LIMIT)
    }
  }

  useEffect(() => {
    getBrandByIdHandler()
    getAllBrandsHandler()
    getBrandItemsHandler()
    getAllBrandItems()
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
          <div onClick={() => { deleteBrandHandler() }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}

    {loading ? (<div className="overlay"><OverlayLoading /></div>) : (
      <div className="row">
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>
        <div>
          <button className='back-edit' onClick={() => {
            params?.pageNumber ?
              navigate(`/brands/page/${params?.pageNumber}`)
              : navigate(`/brands`)
          }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-12">
          <div className="cover-image">
            <img src={
              brand?.coverImage ?
                brand?.coverImage?.includes('https://') ?
                  brand?.coverImage :
                  imageEndPoint + brand?.coverImage
                : "https://www.lcca.org.uk/media/574173/brand.jpg"
            }
              alt="cover image" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                brand?.image ?
                  brand?.image?.includes('https://') ?
                    brand?.image :
                    `${imageEndPoint}${brand?.image}`
                  : "https://www.lcca.org.uk/media/574173/brand.jpg"
              }
              alt="Brand Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => {
                    params?.pageNumber ?
                      navigate(`/brands/page/${params?.pageNumber}/${params?.id}/edit`)
                      : navigate(`/brands/${params?.id}/edit`)
                  }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    brand?.isArchived ? (
                      <button
                        className='edit btn btn-warning'
                        onClick={removeFromArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner spin"></i> : "Remove from Archive"}
                      </button>
                    ) : (
                      <button
                        className='edit btn btn-warning'
                        onClick={addToArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner spin"></i> : "Add to Archive"}
                      </button>
                    )
                  }
                  <button onClick={() => { setModalShow(true) }}
                    className='delete btn btn-danger'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <h2>{brand?.name}</h2>
            <p><span>Brand Email:</span> {brand?.email}</p>
            <p><span>Brand Phone:</span> {brand?.phone}</p>
            <p><span>Brand Likes:</span> {brand?.numberOfLikes}</p>
            <p><span>Brand Categories:</span> {
              categories?.map((category) => {
                return category?.name + ", "
              })
            }</p>
            <p><span>Number of items:</span> {loadingAllItems ? <i className="fas fa-spinner fa-spin "></i> : totalBrandItems}</p>
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

        <div className='cat-items-style'><p>Brand Items</p></div>
        <InfiniteScroll
          dataLength={brandItems?.length}
          next={fetchMoreData}
          hasMore={brandItems?.length < totalBrandItems}
          loader={<h4 className='loading-infinity-scroll'><i className="spinner-border"></i></h4>}
          endMessage={
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="row">
            {
              brandItems.map((item) => {
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
