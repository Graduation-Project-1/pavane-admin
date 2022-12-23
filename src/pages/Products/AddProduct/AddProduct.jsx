import Joi from 'joi';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandServices from '../../../services/brandServices';
import categoryServices from '../../../services/categoryServices';
import productServices from '../../../services/productServices';
import './AddProduct.scss'

export default function AddProduct() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [gender, setGender] = useState("male");
  const [kids, setKids] = useState(false);
  const [xsSize, setXsSize] = useState(false);
  const [sSize, setSSize] = useState(false);
  const [mSize, setMSize] = useState(false);
  const [lSize, setLSize] = useState(false);
  const [xlSize, setXLSize] = useState(false);
  const [xxlSize, setXXLSize] = useState(false);
  const [redColor, setRedColor] = useState(false);
  const [greenColor, setGreenColor] = useState(false);
  const [blueColor, setBlueColor] = useState(false);
  const [blackColor, setBlackColor] = useState(false);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [brand, setBrand] = useState("")
  const [brands, setBrands] = useState([])

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    discountRate: ""
  })

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  function getNewProductData(e) {
    let newProductData = { ...newProduct }
    newProductData[e.target.name] = e.target.value
    setNewProduct(newProductData)
  }





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

  async function getAllBrandsHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getAllVendors();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrands(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function addProductValidation(newProduct) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^(?![\s.]+$)[a-zA-Z\s.]*$/)
        .min(3)
        .max(30)
        .required(),
      price: Joi.number().positive().required(),
      description: Joi.string().pattern(/^(?![\s.]+$)[a-zA-Z\s.]*$/).min(3).max(50).required(),
      discountRate: Joi.number().positive()
    });
    return schema.validate(newProduct, { abortEarly: false });
  }

  async function addProductHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addProductValidation(newProduct);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let sizes = []
      if (xsSize) {
        sizes.push("XS")
      }
      if (sSize) {
        sizes.push("S")
      }
      if (mSize) {
        sizes.push("M")
      }
      if (lSize) {
        sizes.push("L")
      }
      if (xlSize) {
        sizes.push("XL")
      }
      if (xxlSize) {
        sizes.push("XXL")
      }

      let colors = []
      if (redColor) {
        colors.push("red")
      }
      if (greenColor) {
        colors.push("green")
      }
      if (blueColor) {
        colors.push("blue")
      }
      if (blackColor) {
        colors.push("black")
      }

      try {
        let productData = {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          gender: gender,
          kids: kids,
          discountRate: newProduct.discountRate,
          availableSize: sizes,
          availableColors: colors,
          vendorId: brand,
          categoryList: getFinalCategories()
        }

        const { data } = await productServices.addProduct(productData)
        if (data.success && data.message === "productAdded") {
          setLoading(false);
          let productID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await productServices.uploadProductCover(productID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/products");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getAllCategoriesHandler()
    getAllBrandsHandler()
  }, [])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-product-page">
          <div className="add-product-card">
            <h3>Add Product</h3>
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
                Add Cover Image
              </label>
            </div>

            <form onSubmit={addProductHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewProductData}
                className='form-control add-product-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="name">Description</label>
              <input
                onChange={getNewProductData}
                className='form-control add-product-input'
                type="text"
                name="description"
                id="description"
              />
              <label htmlFor="name">Price</label>
              <input
                onChange={getNewProductData}
                className='form-control add-product-input'
                type="number"
                name="price"
                id="price"
              />
              <label htmlFor="name">Discount</label>
              <input
                onChange={getNewProductData}
                className='form-control add-product-input'
                type="number"
                name="discountRate"
                id="discount"
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-product-input">
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
              <div className="check add-product-input">
                <input type="checkbox" id="kids" onChange={(e) => { setKids(e.target.checked) }} />
                <label htmlFor='kids'>For Kids</label>
              </div>
              <label htmlFor="">Avaliable Sizes</label>
              <div className="check">
                <input value='xs' type="checkbox" id="xs" onChange={(e) => { setXsSize(e.target.checked) }} />
                <label htmlFor='xs'>XS</label>
              </div>
              <div className="check">
                <input value='s' type="checkbox" id="s" onChange={(e) => { setSSize(e.target.checked) }} />
                <label htmlFor='s'>S</label>
              </div>
              <div className="check">
                <input value='m' type="checkbox" id="m" onChange={(e) => { setMSize(e.target.checked) }} />
                <label htmlFor='m'>M</label>
              </div>
              <div className="check">
                <input value='l' type="checkbox" id="l" onChange={(e) => { setLSize(e.target.checked) }} />
                <label htmlFor='l'>L</label>
              </div>
              <div className="check">
                <input value='xl' type="checkbox" id="xl" onChange={(e) => { setXLSize(e.target.checked) }} />
                <label htmlFor='xl'>XL</label>
              </div>
              <div className="check add-product-input">
                <input value='xxl' type="checkbox" id="xxl" onChange={(e) => { setXXLSize(e.target.checked) }} />
                <label htmlFor='xxl'>XXL</label>
              </div>

              <label htmlFor="">Avaliable Colors</label>
              <div className="check">
                <input value='red' type="checkbox" id="red" onChange={(e) => { setRedColor(e.target.checked) }} />
                <label htmlFor='red'><div className='red-color'></div></label>
              </div>
              <div className="check">
                <input value='green' type="checkbox" id="green" onChange={(e) => { setGreenColor(e.target.checked) }} />
                <label htmlFor='green'><div className='green-color'></div></label>
              </div>
              <div className="check">
                <input value='blue' type="checkbox" id="blue" onChange={(e) => { setBlueColor(e.target.checked) }} />
                <label htmlFor='blue'><div className='blue-color'></div></label>
              </div>
              <div className="check add-product-input">
                <input value='black' type="checkbox" id="black" onChange={(e) => { setBlackColor(e.target.checked) }} />
                <label htmlFor='black'><div className='black-color'></div></label>
              </div>

              <p className='select-categories'>Avaliable Categories</p>
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

              <label>Select Brand</label>
              <select onChange={(e) => { setBrand(e.target.value) }} className='form-control add-customer-input' id="brand" name="brand" title='brand'>
                <option defaultValue='City'>-- Brand --</option>
                {brands.map((brand) => {
                  return (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  )
                })}
              </select>

              <button className='add-product-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
