import Joi from 'joi';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import advertisementServices from '../../../services/advertisementServices';
import './AddAdvertisement.scss'

export default function AddAdvertisement() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null)

  const [newAdvertisement, setNewAdvertisement] = useState({
    name: "",
    link: ""
  })

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  function getNewAdvertisementData(e) {
    let newAdvertisementData = { ...newAdvertisement }
    newAdvertisementData[e.target.name] = e.target.value
    setNewAdvertisement(newAdvertisementData)
  }

  function addAdvertisementValidation(newAdvertisement) {
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

  async function addAdvertisementHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addAdvertisementValidation(newAdvertisement);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        let advertisementData = {
          name: newAdvertisement.name,
          link: newAdvertisement.link
        }
        const { data } = await advertisementServices.addAdvertisement(advertisementData)
        if (data.success && data.message === "advertisementAdded") {
          setLoading(false);
          let advertisementID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await advertisementServices.uploadImageAdvertisement(advertisementID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/advertisements");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-advertisement-page">
          <div className="add-advertisement-card">
            <h3>Add Advertisement</h3>
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
                  src={uploadImage ? URL.createObjectURL(uploadImage) : null}
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

            <form onSubmit={addAdvertisementHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewAdvertisementData}
                className='form-control add-advertisement-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="link">Link</label>
              <input
                onChange={getNewAdvertisementData}
                className='form-control add-advertisement-input'
                type="text"
                name="link"
                id="link"
              />
              <button className='add-advertisement-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Advertisement"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
