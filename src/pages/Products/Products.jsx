import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import productServices from '../../services/productServices'
import './Products.scss'

export default function Products() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllProductsHandler() {
    setLoading(true)
    try {
      const { data } = await productServices.getAllProducts();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setProducts(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllProductsHandler()
  }, [])

  return <>
    <div className="products">
      <div className="row">
        <div className="col-md-12">
          <div className="add-product">
            <button
              className='add-product-btn'
              onClick={() => { navigate(`/products/addProduct`) }}>
              Add Product
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
          <div className="product-data">
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
                    products.map((product, index) => {
                      return (
                        <tr key={product._id} onClick={() => navigate(`/products/${product._id}`)}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.gender}</td>
                          <td>{product.price}</td>
                          <td>{product.numberOfLikes}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
}
