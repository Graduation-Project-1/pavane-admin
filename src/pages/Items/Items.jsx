import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import itemServices from '../../services/itemServices'
import './Items.scss'

export default function Items() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllItemsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllItems();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setItems(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllItemsHandler()
  }, [])

  return <>
    <div className="items">
      <div className="row">
        <div className="col-md-12">
          <div className="add-item">
            <button
              className='add-item-btn'
              onClick={() => { navigate(`/items/addItem`) }}>
              Add Item
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
          <div className="item-data">
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
                    items.map((item, index) => {
                      return (
                        <tr key={item._id} onClick={() => navigate(`/items/${item._id}`)}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.gender}</td>
                          <td>{item.price}</td>
                          <td>{item.numberOfLikes}</td>
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
