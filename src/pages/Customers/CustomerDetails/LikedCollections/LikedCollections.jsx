import React from 'react'
import { useNavigate } from 'react-router-dom'
import imageEndPoint from '../../../../services/imagesEndPoint';
import './LikedCollections.scss'

export default function LikedCollections(props) {

  const navigate = useNavigate()

  return <>
    <div className="row">
      {
        props?.customerData?.likedCollections?.map((item) => {
          return (
            <div className="col-md-3" key={item?._id}>
              <div className="item" onClick={() => navigate(`/collections/${item?._id}`)}>
                <div className="image">
                  <img src={item?.image?.includes('https://') ?
                    item?.image :
                    `${imageEndPoint}${item?.image}`}
                    alt="Collection Image" />
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
