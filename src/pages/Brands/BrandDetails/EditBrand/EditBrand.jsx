import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import brandServices from '../../../../services/brandServices'
import categoryServices from '../../../../services/categoryServices'
import uploadImagesServices from '../../../../services/uploadImagesServices'
import './EditBrand.scss'

export default function EditBrand() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categoriesId, setCategoriesId] = useState([])

  const [oldBrand, setOldBrand] = useState({
    name: "",
    email: "",
    phone: [],
    categoryList: ""
  })

  const [newBrand, setNewBrand] = useState({
    name: "",
    email: "",
    phone: "",
    categoryList: ""
  })

  // const [brandData, setBrandData] = useState({
  //   name: "",
  //   email: "",
  //   phone: ""
  // })

  function checkUpdatedFields(newData, oldData) {
    let finalEditiedData = {}

    Object.keys(oldData).forEach((oldDataKey) => {
      if (oldData[oldDataKey] !== newData[oldDataKey]) {
        finalEditiedData = { ...finalEditiedData, [oldDataKey]: newData[oldDataKey] }
      }
    })
    return finalEditiedData
  }

  async function getBrandByIdHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getVendorById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
          categoryList: data?.Data?.categoryList
        })
        setNewBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
          categoryList: data?.Data?.categoryList
        })
        setUploadImage(data?.Data?.image)
        setCategoriesId(data?.Data?.categoryList)

      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewBrandData(e) {
    let newBrandData = { ...newBrand }
    newBrandData[e.target.name] = e.target.value
    setNewBrand(newBrandData)
  }

  function editBrandValidation(newBrand) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^(?![\s.]+$)[a-zA-Z\s.]*$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.any(),
      categoryList: Joi.any()
    });
    return schema.validate(newBrand, { abortEarly: false });
  }

  async function editBrandHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editBrandValidation(newBrand);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newBrand, oldBrand)).forEach((key) => {
        if (key === "phone") {
          editedData = {
            ...editedData,
            phone: [newBrand["phone"]]
          }
        } else {
          editedData = {
            ...editedData,
            [key]: newBrand[key]
          }
        }
      })
      try {
        const { data } = await brandServices.editVendor(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          navigate(`/brands/${params.id}`);
        } else {
          console.log(data);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        // setErrorMessage(error.response);
      }
    }
  };

  async function uploadBrandImageHandler(e) {
    try {
      var formData = new FormData();
      formData.append("images", uploadImage);
      const { data } = await uploadImagesServices.uploadImages(formData)
      if ((data.Data).length > 0) {
        let path = (data.Data)[0]
        await brandServices.editVendor(params.id, { image: path })
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error);
    }
  }

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
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
    getBrandByIdHandler()
    getAllCategoriesHandler()
  }, [])

  // useEffect(() => {
  //   uploadBrandImageHandler()
  // }, [uploadImage])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-category-page">
          <div className="edit-category-card">
            <h3>Edit Brand</h3>
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
                  src={uploadImage}
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
            <form onSubmit={editBrandHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-category-input'
                type="text"
                name="name"
                id="name"
                value={newBrand.name}
              />
              <label htmlFor="name">Email</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-category-input'
                type="email"
                name="email"
                id="email"
                value={newBrand.email}
              />
              <label htmlFor="name">Phone</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-category-input'
                type="number"
                name="phone"
                id="phone"
                value={newBrand.phone}
              />
              <p className='select-categories'>Select Categories</p>
              {
                categories.map((category, index) => {
                  return (
                    <div className="check" key={category._id}>

                      <input checked={newBrand.categoryList[index]} type="checkbox" id={category.name} onChange={(e) => { toggleSelectedCategoriesHandler(category._id) }} />

                      <label htmlFor={category.name}>{category.name}</label>
                    </div>
                  )
                })
              }
              <button className='add-category-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Brand"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
