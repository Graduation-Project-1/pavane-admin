import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import categoryServices from '../../../../services/categoryServices'
import toastPopup from '../../../../helpers/toastPopup'
import imageEndPoint from '../../../../services/imagesEndPoint'
import './EditCategory.scss'

export default function EditCategory() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);

  const [oldCategory, setOldCategory] = useState({
    name: ""
  })

  const [newCategory, setNewCategory] = useState({
    name: ""
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

  async function getCategoryByIdHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getCategoryById(params.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setOldCategory({
          name: data?.Data?.name
        })
        setNewCategory({
          name: data?.Data?.name
        })
        setUploadImage(data?.Data?.image)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function getNewCategoryData(e) {
    let newCategoryData = { ...newCategory }
    newCategoryData[e.target.name] = e.target.value
    setNewCategory(newCategoryData)
  }

  function editCategoryValidation(newCategory) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z0-9 &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required()
    });
    return schema.validate(newCategory, { abortEarly: false });
  }

  async function editCategoryHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editCategoryValidation(newCategory);
    setLoading(true);
    if (validationResult?.error) {
      setLoading(false);
      setErrorList(validationResult?.error?.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newCategory, oldCategory)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newCategory[key]
        }
      })
      try {
        const { data } = await categoryServices.editCategory(params?.id, editedData)
        if (data?.success && data?.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = await categoryServices.uploadImageCategory(params?.id, formData)
            if (data?.success && data?.code === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          if (params?.pageNumber) {
            navigate(`/categories/page/${params?.pageNumber}/${params?.id}`)
          } else {
            navigate(`/categories/${params?.id}`)
          }
          toastPopup.success("Category updated successfully")
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error?.response?.data?.message);
      }
    }
  };

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  useEffect(() => {
    getCategoryByIdHandler()
  }, [])

  return <>
    <div>
      <button className='back-edit' onClick={() => {
        params?.pageNumber ?
          navigate(`/categories/page/${params?.pageNumber}/${params?.id}`)
          : navigate(`/categories/${params?.id}`)
      }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-category-page">
          <div className="edit-category-card">
            <h3>Edit Category</h3>
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
            <form onSubmit={editCategoryHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCategoryData}
                className='form-control add-category-input'
                type="text"
                name="name"
                id="name"
                value={newCategory?.name}
              />
              <button className='add-category-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
