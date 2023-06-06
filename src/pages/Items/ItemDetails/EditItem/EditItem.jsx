import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import itemServices from '../../../../services/itemServices';
import categoryServices from '../../../../services/categoryServices';
import Multiselect from 'multiselect-react-dropdown';
import toastPopup from '../../../../helpers/toastPopup';
import imageEndPoint from '../../../../services/imagesEndPoint'
import ImagesUpload from '../../../../components/ImagesUpload/ImagesUpload';
import brandServices from '../../../../services/brandServices';
import './EditItem.scss'

export default function EditItem() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadCover, setUploadCover] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [itemImages, setItemImages] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("")
  const [imageToBeDeleted, setImageToBeDeleted] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [brands, setBrands] = useState([])

  let sizesArr = ["XS", "S", "M", "L", "XL", "XXL"]

  const [oldItem, setOldItem] = useState({
    name: "",
    price: 0,
    description: "",
    gender: "",
    isAdult: true,
    sizes: [],
    categoryList: "",
    discountRate: "",
    brandId: ""
  })

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    description: "",
    gender: "",
    isAdult: true,
    sizes: [],
    categoryList: "",
    discountRate: "",
    brandId: ""
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

  async function getItemByIdHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getItemById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldItem({
          name: data?.Data?.name,
          price: data?.Data?.price,
          description: data?.Data?.description,
          gender: data?.Data?.gender,
          isAdult: data?.Data?.isAdult,
          sizes: data?.Data?.sizes,
          discountRate: data?.Data?.discountRate,
          brandId: data?.Data?.brandId?._id,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id })
        })
        setNewItem({
          name: data?.Data?.name,
          price: data?.Data?.price,
          description: data?.Data?.description,
          gender: data?.Data?.gender,
          isAdult: data?.Data?.isAdult,
          sizes: data?.Data?.sizes,
          discountRate: data?.Data?.discountRate,
          brandId: data?.Data?.brandId?._id,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id })
        })
        setUploadCover(data?.Data?.cover)
        setSelectedCategories(data?.Data?.categoryList)
        setSelectedSizes(data?.Data?.sizes)
        setItemImages(data?.Data?.images)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewItemData(e) {
    let newItemData = { ...newItem }
    newItemData[e.target.name] = e.target.value
    setNewItem(newItemData)
  }

  async function editItemHandler(e) {
    e.preventDefault();
    setLoading(true);
    let editedData = {};

    Object.keys(checkUpdatedFields(newItem, oldItem)).forEach((key) => {
      editedData = {
        ...editedData,
        [key]: newItem[key]
      }
    })

    try {
      const { data } = await itemServices.updateItem(params?.id, editedData)
      setLoading(false);
      var formData = new FormData();
      formData.append("images", uploadCover);
      setLoading(true);
      try {
        const { data } = typeof uploadCover === "object" && await itemServices.uploadItemCover(params?.id, formData)
        if (data?.success && data?.status === 200) {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error);
      }

      var imagesFormData = new FormData();
      uploadImages.forEach((image) => {
        imagesFormData.append('images', image.file);
      });
      setLoading(true)
      try {
        const { data } = await itemServices.uploadItemImages(params?.id, imagesFormData)
        setLoading(true)
        if (data?.success && data?.status === 200) {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error);
      }
      navigate(`/items/page/${params?.pageNumber}/${params?.id}`)
      toastPopup.success("Item updated successfully")
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response);
    }
  };

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
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
    return newItem["categoryList"].includes(categoreyId)
  }

  function toggleSelectedCategoriesHandler(categoryId) {
    if (isSelectedCategory(categoryId)) {
      let oldSelectedCategories = newItem["categoryList"]
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setNewItem((prev) => { return { ...prev, categoryList: newSelectedCategories } })
    } else {
      setNewItem((prev) => { return { ...prev, categoryList: [...prev.categoryList, categoryId] } })
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

  let selected_sizes = selectedSizes.map((selected_size) => {
    return ({
      name: selected_size
    })
  })

  function isSelectedSize(size) {
    return newItem["sizes"].includes(size)
  }

  function toggleSelectedSizesHandler(size) {
    if (isSelectedSize(size)) {
      let oldSelectedSizes = newItem["sizes"]
      let newSelectedSizes = oldSelectedSizes.filter((singleSize) => { return singleSize !== size?.name })
      setNewItem((prev) => { return { ...prev, sizes: newSelectedSizes } })
    } else {
      setNewItem((prev) => { return { ...prev, sizes: [...prev.sizes, size?.name] } })
    }
  }

  let sizesOptions = sizesArr.map((size) => {
    return ({
      name: size
    })
  })

  function getImage(image) {
    setImageUrl(image);
  }

  function onDleteFromCurrent(image) {
    setImageToBeDeleted(image)
    setModalShow(true)
  }

  async function deleteItemImage() {
    setLoading(true);
    try {
      const { data } = await itemServices.deleteImagesFromItem(params.id,
        {
          "images": [
            imageToBeDeleted
          ]
        });
      setLoading(false);
      setModalShow(false);
      getItemByIdHandler();
      toastPopup.success("Image deleted successfully");
    } catch (e) {
      setLoading(false);
      setErrorMessage(e);
    }
  }

  async function getAllBrandsHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getAllBrands(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setBrands(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getItemByIdHandler()
    getAllCategoriesHandler()
    getAllBrandsHandler()
  }, [])

  return <>
    <div>
      <button className='back-edit' onClick={() => { navigate(`/items/page/${params?.pageNumber}/${params.id}`) }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>

    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { deleteItemImage() }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}

    <div className="row">
      <div className="col-md-12">
        <div className="edit-item-page">
          <div className="edit-item-card">
            <h3>Edit Item</h3>
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
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
                ref={ref}
                onChange={(e) => {
                  setUploadCover(e.target.files[0]);
                }}
              />
              <label
                className="main-label-image"
                onClick={imageUploader}
                htmlFor="upload-img"
              >
                Add Cover
              </label>
            </div>

            <ImagesUpload
              type="edit"
              viewList={itemImages}
              getImage={getImage}
              onDleteFromCurrent={onDleteFromCurrent}
              uploadedImagesList={uploadImages}
              setUploadedImagesList={setUploadImages}
            />

            <form onSubmit={editItemHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewItemData}
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
                value={newItem.name}
              />
              <label htmlFor="description">Description</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="text"
                name="description"
                id="description"
                value={newItem.description}
              />
              <label htmlFor="price">Price</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="number"
                name="price"
                id="price"
                value={newItem.price}
              />
              <label htmlFor="name">Discount</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="number"
                name="discountRate"
                id="discount"
                value={newItem.discountRate}
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-item-input">
                <input
                  onChange={getNewItemData}
                  value='male'
                  type="radio"
                  name="gender"
                  id="male"
                  checked={newItem.gender === 'male'}
                />
                <input
                  onChange={getNewItemData}
                  value='female'
                  type="radio"
                  name="gender"
                  id="female"
                  checked={newItem.gender === 'female'}
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
              <div className="check add-item-input">
                <input
                  checked={newItem.isAdult}
                  type="checkbox"
                  id="isAdult"
                  onChange={(e) => { setNewItem((prev) => { return { ...prev, isAdult: e.target.checked } }) }} />
                <label htmlFor='isAdult'>For Adults</label>
              </div>

              <label htmlFor="">Avaliable Sizes</label>
              <Multiselect
                displayValue="name"
                selectedValues={selected_sizes}
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedSizesHandler(selectedItem)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedSizesHandler(selectedItem)
                }}
                options={sizesOptions}
                showCheckbox
              />

              <p className='select-categories'>Select Categories</p>
              <Multiselect
                displayValue="name"
                selectedValues={selected_categories}
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem.id)
                }}
                options={categoriesOptions}
                showCheckbox
              />

              <label>Select Brand</label>
              <select
                onChange={(e) => {
                  setNewItem((prev) => {
                    return { ...prev, brandId: e.target.value };
                  });
                }}
                className='form-control add-customer-input'
                id="brand"
                name="brand"
                title='brand'
                value={newItem?.brandId}>
                <option value=''>-- Brand --</option>
                {brands.map((brand) => {
                  return (
                    <option key={brand?._id} value={brand?._id}>{brand?.name}</option>
                  )
                })}
              </select>
              <button className='add-brand-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
