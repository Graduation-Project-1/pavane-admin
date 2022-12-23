import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../../services/brandServices'
import productServices from '../../../services/productServices'
import './ProductDetails.scss'

export default function ProductDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({})
  const [categories, setCategories] = useState([])
  const [brand, setBrand] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getProductByIdHandler() {
    setLoading(true)
    try {
      const { data } = await productServices.getProductById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setProduct(data.Data)
        setCategories(data.Data.categoryList)
        getBrandByIdHandler(data.Data.vendorId)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function getBrandByIdHandler(id) {
    setLoading(true)
    try {
      const { data } = await brandServices.getVendorById(id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrand(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function deleteProductHandler() {
    setLoading(true)
    try {
      const { data } = await productServices.deleteProduct(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/products`)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getProductByIdHandler()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { deleteProductHandler() }} className='delete btn btn-danger w-50'>Delete</div>
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
        <div className="col-md-4">
          <div className="image">
            <img src={product.cover} alt="Productc Cover" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="product-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/products/${params.id}/edit`) }} className='edit btn btn-warning'>Edit</button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{product.name}</h2>
            <p>Product Description: {product.description}</p>
            <p>Brand: {brand.name}</p>
            <p>Price: {product.price}</p>
            <p>Discount: {product.discountRate}</p>
            <p>Discount: {product.discountRate}</p>
            <p>Gender: {product.gender}</p>
            {product.gender ? <p>For Kids: Yes</p> : <p>For Kids: No</p>}
            <p>Available Sizes: {product.availableSize + ", "}</p>
            <p>Available Colors: {product.availableColors + ", "}</p>
            <p>Available Categories: {
              categories.map((category) => {
                return category.name + ", "
              })
            }</p>
            <p>Reviews: {product.numberOfReviews}</p>
            <p>Likes: {product.numberOfLikes}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
