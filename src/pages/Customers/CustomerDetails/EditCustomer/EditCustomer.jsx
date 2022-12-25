import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import customerServices from '../../../../services/customerServices'
import './EditCustomer.scss'

export default function EditCustomer() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);

  const [oldCustomer, setOldCustomer] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    gender: "",
    location: ""
  })

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    gender: "",
    location: ""
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

  async function getCustomerByIdHandler() {
    setLoading(true)
    try {
      const { data } = await customerServices.getUserById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldCustomer({
          name: data?.Data?.name,
          email: data?.Data?.email,
          dateOfBirth: data?.Data?.dateOfBirth,
          phone: data?.Data?.phone,
          gender: data?.Data?.gender,
          location: data?.Data?.location,
        })
        setNewCustomer({
          name: data?.Data?.name,
          email: data?.Data?.email,
          dateOfBirth: data?.Data?.dateOfBirth,
          phone: data?.Data?.phone,
          gender: data?.Data?.gender,
          location: data?.Data?.location,
        })
        setUploadImage(data?.Data?.image)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewCustomerData(e) {
    let newCustomerData = { ...newCustomer }
    newCustomerData[e.target.name] = e.target.value
    setNewCustomer(newCustomerData)
  }

  function editCustomerValidation(newCustomer) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      dateOfBirth: Joi.string(),
      phone: Joi.number(),
      gender: Joi.string(),
      location: Joi.string()
    });
    return schema.validate(newCustomer, { abortEarly: false });
  }

  async function editCustomerHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editCustomerValidation(newCustomer);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newCustomer, oldCustomer)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newCustomer[key]
        }
      })
      try {
        const { data } = await customerServices.editUser(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object" && await customerServices.uploadUserImage(params.id, formData)
            if (data.success && data.code === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate(`/customers/${params.id}`);
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
    getCustomerByIdHandler()
  }, [])

  let date = (newCustomer.dateOfBirth).split('T')[0]

  console.log(newCustomer.gender);

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-customer-page">
          <div className="edit-customer-card">
            <h3>Edit Customer</h3>
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
                Add Image
              </label>
            </div>
            <form onSubmit={editCustomerHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="text"
                name="name"
                id="name"
                value={newCustomer.name}
              />
              <label htmlFor="email">Email</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="email"
                name="email"
                id="email"
                value={newCustomer.email}
              />
              <label htmlFor="phone">phone</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="number"
                name="phone"
                id="phone"
                value={newCustomer.phone}
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-customer-input">
                <input
                  onChange={getNewCustomerData}
                  value='male'
                  type="radio"
                  name="gender"
                  id="male"
                  checked={newCustomer.gender === 'male'}
                />
                <input
                  onChange={getNewCustomerData}
                  value='female'
                  type="radio"
                  name="gender"
                  id="female"
                  checked={newCustomer.gender === 'female'}
                />
                <label htmlFor="male" className="option male">
                  <div className="dot"></div>
                  <span>Male</span>
                </label>
                <label htmlFor="female" className="option female">
                  <div className="dot"></div>
                  <span>Female</span>
                </label>
              </div>
              <label htmlFor="dateOfBirth">Date Of Birth</label>
              <div className="date add-customer-input">
                <input
                  onChange={getNewCustomerData}
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className='picker'
                  value={date}
                />
              </div>
              <label>City</label>
              <select onChange={getNewCustomerData} selected={newCustomer.location} value={newCustomer.location} className='form-control add-customer-input' id="location" name="location" title='location'>
                <option value={0} disabled>-- City --</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option>
              </select>
              <button className='add-customer-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Customer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
