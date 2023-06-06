import React from 'react'
import imageEndPoint from '../../../../services/imagesEndPoint';
import { useNavigate } from 'react-router-dom'
import './LikedBrands.scss'

export default function LikedBrands(props) {

  const navigate = useNavigate()

  return <>
    <div className="row">
      {
        props?.customerData?.likedBrands?.map((item) => {
          return (
            <div className="col-md-3" key={item?._id}>
              <div className="item" onClick={() => navigate(`/brands/${item?._id}`)}>
                <div className="image">
                  <img src={item?.image?.includes('https://') ?
                    item?.image :
                    `${imageEndPoint}${item?.image}`}
                    alt="Brand Image" />
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
