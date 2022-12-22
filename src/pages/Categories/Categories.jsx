import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../services/categoryServices'
import './Categories.scss'

export default function Categories() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCategories(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler()
  }, [])

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
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    categories.map((category, index) => {
                      return (
                        <tr key={category._id} onClick={() => navigate(`/categories/${category._id}`)}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
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
