import Joi from 'joi';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customerServices from '../../../services/customerServices';
import { ReactComponent as EyeOPen } from "../../../assets/eye_open.svg";
import { ReactComponent as EyeClose } from "../../../assets/eye_close.svg";
import './AddCustomer.scss'

export default function AddCustomer() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let type = "password"

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  function getNewCustomerData(e) {
    let newCustomerData = { ...newCustomer }
    newCustomerData[e.target.name] = e.target.value
    setNewCustomer(newCustomerData)
  }

  function addCustomerValidation(newCustomer) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .required()
        .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .messages({
          "string.base": "please enter a valid password",
          "any.required": "password must be entered",
          "string.empty": "password cannot be empty",
          "string.pattern.base": "Wrong Password"
        }),
      phone: Joi.number()
    });
    return schema.validate(newCustomer, { abortEarly: false });
  }

  async function addCustomerHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addCustomerValidation(newCustomer);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        let customerData = {
          name: newCustomer.name,
          email: newCustomer.email,
          password: newCustomer.password,
          phone: newCustomer.phone,
          dateOfBirth: dateOfBirth,
          gender: gender,
          location: location,
        }
        const { data } = await customerServices.addCustomer(customerData)
        if (data.success && data.message === "customerAdded") {
          setLoading(false);
          let customerID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await customerServices.uploadImageCustomer(customerID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/customers");
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
        <div className="add-customer-page">
          <div className="add-customer-card">
            <h3>Add Customer</h3>
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
                Add Image
              </label>
            </div>

            <form onSubmit={addCustomerHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="email">Email</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="email"
                name="email"
                id="email"
              />
              <div className="password-field">
                {type === "password" ? (
                  showPassword ? (
                    <EyeOPen
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                      className="show-password-icon"
                    />
                  ) : (
                    <EyeClose
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                      className="show-password-icon"
                    />
                  )
                ) : null}
                <label htmlFor="password">Password</label>
                <input
                  onChange={getNewCustomerData}
                  className='form-control add-customer-input'
                  type={!type === "password" ? type : showPassword ? "text" : type}
                  name="password"
                  id="password"
                />
              </div>
              <label htmlFor="phone">Phone</label>
              <input
                onChange={getNewCustomerData}
                className='form-control add-customer-input'
                type="number"
                name="phone"
                id="phone"
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-customer-input">
                <input
                  onChange={(e) => { setGender(e.target.value) }}
                  value='male'
                  type="radio"
                  name="gender"
                  id="male"
                  defaultChecked
                />
                <input
                  onChange={(e) => { setGender(e.target.value) }}
                  value='female'
                  type="radio"
                  name="gender"
                  id="female"
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
              <label htmlFor="dateOfBirth">Date of birth</label>
              <div className="date add-customer-input">
                <input
                  onChange={(e) => { setDateOfBirth(e.target.value); }}
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className='picker'
                />
              </div>
              <label>City</label>
              <select onChange={(e) => { setLocation(e.target.value) }} className='form-control add-customer-input' id="location" name="location" title='location'>
                <option defaultValue='City'>-- City --</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option>
              </select>
              <button className='add-customer-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Customer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
