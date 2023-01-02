import Joi from 'joi';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandServices from '../../../services/brandServices';
import categoryServices from '../../../services/categoryServices';
import { ReactComponent as EyeOPen } from "../../../assets/eye_open.svg";
import { ReactComponent as EyeClose } from "../../../assets/eye_close.svg";
import './AddBrand.scss'

export default function AddBrand() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadCover, setUploadCover] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showPassword, setShowPassword] = useState(false);

  let type = "password"

  const [newBrand, setNewBrand] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })

  const ref = useRef();
  const coverRef = useRef();

  const imageUploader = (e) => {
    ref.current.click();
  };

  const coverUploader = (e) => {
    coverRef.current.click();
  };

  function getNewBrandData(e) {
    let newBrandData = { ...newBrand }
    newBrandData[e.target.name] = e.target.value
    setNewBrand(newBrandData)
  }

  function addBrandValidation(newBrand) {
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
    return schema.validate(newBrand, { abortEarly: false });
  }

  async function addBrandHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addBrandValidation(newBrand);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        let brandData = {
          name: newBrand.name,
          email: newBrand.email,
          password: newBrand.password,
          phone: [newBrand.phone],
          categoryList: getFinalCategories()
        }
        const { data } = await brandServices.addBrand(brandData)
        if (data.success && data.message === "BrandAdded") {
          setLoading(false);
          let brandID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await brandServices.uploadImageBrand(brandID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          var formDataCover = new FormData();
          formDataCover.append("images", uploadCover);
          setLoading(true)
          try {
            const { data } = await brandServices.uploadCoverImageBrand(brandID, formDataCover)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/brands");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

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

  function toggleSelectedCategoriesHandler(categoryId) {
    if (selectedCategories.includes(categoryId)) {
      let oldSelectedCategories = selectedCategories
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setSelectedCategories(newSelectedCategories)
    } else {
      setSelectedCategories((prev) => { return [...prev, categoryId] })
    }
  }

  function getFinalCategories() {
    let finalBrandCategories = []
    selectedCategories.forEach((selectedCategory) => {
      categories.filter(category => category._id === selectedCategory).map((category) => {
        finalBrandCategories.push(category._id)
      })
    })

    return finalBrandCategories
  }

  useEffect(() => {
    getAllCategoriesHandler()
  }, [])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-brand-page">
          <div className="add-brand-card">
            <h3>Add Brand</h3>
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

            <div className="main-image-label">
              {uploadCover && (
                <img
                  src={uploadCover ? URL.createObjectURL(uploadCover) : null}
                  alt="imag-viewer"
                  className="uploaded-img"
                  onClick={() => {
                    window.open(
                      uploadCover ? URL.createObjectURL(uploadCover) : null
                    );
                  }}
                />
              )}
              <input
                className="main-input-image"
                type="file"
                name="upload-img"
                ref={coverRef}
                onChange={(e) => {
                  setUploadCover(e.target.files[0]);
                }}
              />
              <label
                className="main-label-image"
                onClick={coverUploader}
                htmlFor="upload-img"
              >
                Add Cover
              </label>
            </div>

            <form onSubmit={addBrandHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="email">Email</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
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
                  onChange={getNewBrandData}
                  className='form-control add-brand-input'
                  type={!type === "password" ? type : showPassword ? "text" : type}
                  name="password"
                  id="password"
                />
              </div>
              <label htmlFor="phone">Phone</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="number"
                name="phone"
                id="phone"
              />
              <p className='select-categories'>Select Categories</p>
              {
                categories.map((category) => {
                  return (
                    <div className="check" key={category._id}>
                      <input type="checkbox" id={category.name} onChange={(e) => { toggleSelectedCategoriesHandler(category._id) }} />
                      <label htmlFor={category.name}>{category.name}</label>
                    </div>
                  )
                })
              }
              <button className='add-brand-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Brand"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
