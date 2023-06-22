import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import brandServices from '../../../../services/brandServices'
import categoryServices from '../../../../services/categoryServices'
import imageEndPoint from '../../../../services/imagesEndPoint'
import toastPopup from '../../../../helpers/toastPopup'
import Multiselect from 'multiselect-react-dropdown'
import './EditBrand.scss'

export default function EditBrand() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadCover, setUploadCover] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

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
      const { data } = await brandServices.getBrandById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
          categoryList: data?.Data?.categoryList?.map((cat) => { return cat?._id })
        })
        setNewBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
          categoryList: data?.Data?.categoryList?.map((cat) => { return cat?._id })
        })
        setSelectedCategories(data?.Data?.categoryList)
        setUploadImage(data?.Data?.image)
        setUploadCover(data?.Data?.coverImage)

      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
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
        .pattern(/^[a-zA-Z0-9 &_\-'"\\|,.\/]*$/)
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
    if (validationResult?.error) {
      setLoading(false);
      setErrorList(validationResult?.error?.details);
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
        const { data } = await brandServices.editBrand(params?.id, editedData)
        if (data?.success && data?.status === 200) {
          setLoading(false);
          if (typeof (uploadImage) === 'object') {
            var formData = new FormData();
            formData.append("images", uploadImage);
            setLoading(true);
            try {
              const { data } = typeof uploadImage === "object" &&
                await brandServices.uploadImageBrand(params?.id, formData)
              if (data?.success && data?.status === 200) {
                setLoading(false);
              }
            } catch (error) {
              setLoading(false);
              setErrorMessage(error);
            }
          }
          if (typeof (uploadCover) === 'object') {
            var formDataCover = new FormData();
            formDataCover.append("images", uploadCover);
            setLoading(true);
            try {
              const { data } = typeof uploadCover === "object" && await brandServices.uploadCoverImageBrand(params?.id, formDataCover)
              if (data?.success && data?.status === 200) {
                setLoading(false);
              }
            } catch (error) {
              setLoading(false);
              setErrorMessage(error);
            }
          }
          if (params?.pageNumber) {
            navigate(`/brands/page/${params?.pageNumber}/${params?.id}`)
          } else {
            navigate(`/brands/${params?.id}`)
          }
          toastPopup.success("Brand updated successfully")
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error?.response);
      }
    }
  };

  const ref = useRef();
  const coverRef = useRef();

  const imageUploader = (e) => {
    ref.current.click();
  };

  const coverUploader = (e) => {
    coverRef.current.click();
  };

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategories(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function isSelectedCategory(categoreyId) {
    return newBrand["categoryList"].includes(categoreyId)
  }

  function toggleSelectedCategoriesHandler(categoryId) {
    if (isSelectedCategory(categoryId)) {
      let oldSelectedCategories = newBrand["categoryList"]
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setNewBrand((prev) => { return { ...prev, categoryList: newSelectedCategories } })
    } else {
      setNewBrand((prev) => { return { ...prev, categoryList: [...prev.categoryList, categoryId] } })
    }
  }

  let categoriesOptions = categories.map((category) => {
    return ({
      name: category?.name,
      id: category?._id
    }
    )
  })

  let selected_categories = selectedCategories.map((selectedCategory) => {
    return ({
      name: selectedCategory?.name,
      id: selectedCategory?._id
    })
  })

  useEffect(() => {
    getBrandByIdHandler()
    getAllCategoriesHandler()
  }, [])

  return <>
    <div>
      <button className='back-edit' onClick={() => {
        params?.pageNumber ?
          navigate(`/brands/page/${params?.pageNumber}/${params?.id}`)
          : navigate(`/brands/${params?.id}`)
      }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-brand-page">
          <div className="edit-brand-card">
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
                    {err?.message}
                  </div>
                )
              })
            }

            <div className="main-cover-label">
              {uploadCover && (
                <img
                  src={typeof uploadCover === "object" ? URL.createObjectURL(uploadCover) :
                    (`${imageEndPoint}${uploadCover}`)}
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

            <div className="main-image-label">
              {uploadImage && (
                <img
                  src={typeof uploadImage === "object" ?
                    URL.createObjectURL(uploadImage) :
                    (`${imageEndPoint}${uploadImage}`)}
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
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
                value={newBrand?.name}
              />
              <label htmlFor="name">Email</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="email"
                name="email"
                id="email"
                value={newBrand?.email}
              />
              <label htmlFor="name">Phone</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="number"
                name="phone"
                id="phone"
                value={newBrand?.phone}
              />
              <p className='select-categories'>Select Categories</p>
              <Multiselect
                displayValue="name"
                selectedValues={selected_categories}
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem?.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem?.id)
                }}
                options={categoriesOptions}
                showCheckbox
              />
              <button className='add-brand-button'>
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
