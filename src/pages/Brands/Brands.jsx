import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import './Brands.scss'

export default function Brands() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllBrandsHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getAllVendors();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrands(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllBrandsHandler()
  }, [])

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
      <div className="row">
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
                        <tr key={brand._id} onClick={() => navigate(`/brands/${brand._id}`)}>
                          <td>{index + 1}</td>
                          <td>{brand.name}</td>
                          <td>{brand.email}</td>
                          <td>{brand.phone}</td>
                          <td>{brand.numberOfLikes}</td>
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
