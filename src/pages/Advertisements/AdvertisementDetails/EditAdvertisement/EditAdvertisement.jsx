import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import advertisementServices from '../../../../services/advertisementServices'
import './EditAdvertisement.scss'

export default function EditAdvertisement() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);

  const [oldAdvertisement, setOldAdvertisement] = useState({
    name: "",
    link: ""
  })

  const [newAdvertisement, setNewAdvertisement] = useState({
    name: "",
    link: ""
  })

  function checkUpdatedFields(newData, oldData) {
    let finalEditiedData = {}

    Object.keys(oldData).forEach((oldDataKey) => {
      if (oldData[oldDataKey] !== newData[oldDataKey]) {
        finalEditiedData = { ...finalEditiedData, [oldDataKey]: newData[oldDataKey] }
      }
    })
    return finalEditiedData
  }

  async function getAdvertisementByIdHandler() {
    setLoading(true)
    try {
      const { data } = await advertisementServices.getAdvertisementById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldAdvertisement({
          name: data?.Data?.name,
          link: data?.Data?.link
        })
        setNewAdvertisement({
          name: data?.Data?.name,
          link: data?.Data?.link
        })
        setUploadImage(data?.Data?.image)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewAdvertisementData(e) {
    let newAdvertisementData = { ...newAdvertisement }
    newAdvertisementData[e.target.name] = e.target.value
    setNewAdvertisement(newAdvertisementData)
  }

  function editAdvertisementValidation(newAdvertisement) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required(),
      link: Joi.string()
    });
    return schema.validate(newAdvertisement, { abortEarly: false });
  }

  async function editAdvertisementHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editAdvertisementValidation(newAdvertisement);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newAdvertisement, oldAdvertisement)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newAdvertisement[key]
        }
      })
      try {
        const { data } = await advertisementServices.editAdvertisement(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object" && await advertisementServices.uploadAdvertisementImage(params.id, formData)
            if (data.success && data.code === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate(`/advertisements/${params.id}`);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  useEffect(() => {
    getAdvertisementByIdHandler()
  }, [])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-advertisement-page">
          <div className="edit-advertisement-card">
            <h3>Edit Advertisement</h3>
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
            }
            {
              errorList.map((err, index) => {
                return (
                  <div key={index} className="alert alert-danger myalert">
                    {err.message}
                  </div>
                )
              })
            }
            <div className="main-image-label">
              {uploadImage && (
                <img
                  src={typeof uploadImage === "object" ? URL.createObjectURL(uploadImage) : uploadImage}
                  alt="imag-viewer"
                  className="uploaded-img"
                  onClick={() => {
                    window.open(
                      uploadImage ? URL.createObjectURL(uploadImage) : null
                    );
                  }}
                />
              )}
              <input
                className="main-input-image"
                type="file"
                name="upload-img"
                ref={ref}
                onChange={(e) => {
                  setUploadImage(e.target.files[0]);
                }}
              />
              <label
                className="main-label-image"
                onClick={imageUploader}
                htmlFor="upload-img"
              >
                Add Advertisement
              </label>
            </div>
            <form onSubmit={editAdvertisementHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewAdvertisementData}
                className='form-control add-advertisement-input'
                type="text"
                name="name"
                id="name"
                value={newAdvertisement.name}
              />
              <label htmlFor="link">Link</label>
              <input
                onChange={getNewAdvertisementData}
                className='form-control add-advertisement-input'
                type="text"
                name="link"
                id="link"
                value={newAdvertisement.link}
              />
              <button className='add-advertisement-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Advertisement"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
