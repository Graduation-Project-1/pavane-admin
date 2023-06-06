import React from 'react'
import { useNavigate } from 'react-router-dom'
import imageEndPoint from '../../../../services/imagesEndPoint';
import './LikedItems.scss'

export default function LikedItems(props) {

  const navigate = useNavigate()

  return <>
    <div className="row">
      {
        props?.customerData?.likedItems?.map((item) => {
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
  </>
}
