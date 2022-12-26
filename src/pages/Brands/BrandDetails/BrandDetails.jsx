import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../../services/brandServices'
import './BrandDetails.scss'

export default function BrandDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getBrandByIdHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrand(data.Data)
        setCategories(data.Data.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function deleteBrandHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.deleteBrand(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/brands`)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getBrandByIdHandler()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { deleteBrandHandler() }} className='delete btn btn-danger w-50'>Delete</div>
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
            <img src={brand.image} alt="Brand Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/brands/${params.id}/edit`) }} className='edit btn btn-warning'>Edit</button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{brand.name}</h2>
            <p>Brand Email: {brand?.email}</p>
            <p>Brand Phone: {brand?.phone}</p>
            <p>Brand Likes: {brand?.numberOfLikes}</p>
            <p>Brand Categories: {
              categories.map((category) => {
                return category.name + ", "
              })
            }</p>
          </div>
        </div>
      </div>
    )}
  </>
}
