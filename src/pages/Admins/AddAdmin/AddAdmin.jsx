import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminServices from '../../../services/adminServices';
import { ReactComponent as EyeOPen } from "../../../assets/eye_open.svg";
import { ReactComponent as EyeClose } from "../../../assets/eye_close.svg";
import toastPopup from '../../../helpers/toastPopup';
import './AddAdmin.scss'

export default function AddAdmin() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let type = "password"

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: ""
  })

  function getNewAdminData(e) {
    let newAdminData = { ...newAdmin }
    newAdminData[e.target.name] = e.target.value
    setNewAdmin(newAdminData)
  }

  function addAdminValidation(newAdmin) {
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
        })
    });
    return schema.validate(newAdmin, { abortEarly: false });
  }

  async function addAdminHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addAdminValidation(newAdmin);
    setLoading(true);
    if (validationResult?.error) {
      setLoading(false);
      setErrorList(validationResult?.error?.details);
    } else {
      setLoading(true);
      try {
        const { data } = await adminServices.addAdmin(newAdmin)
        if (data?.success && data?.message === "adminAdded") {
          setLoading(false);
          navigate("/admins");
          toastPopup.success("Admin added successfully")
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error?.response?.data?.message);
      }
    }
  };

  return <>
    <div>
      <button className='back-edit' onClick={() => { navigate(`/admins`) }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="add-admin-page">
          <div className="add-admin-card">
            <h3>Add Admin</h3>
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
            <form onSubmit={addAdminHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewAdminData}
                className='form-control add-admin-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="email">Email</label>
              <input
                onChange={getNewAdminData}
                className='form-control add-admin-input'
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
                  onChange={getNewAdminData}
                  className='form-control add-admin-input'
                  type={!type === "password" ? type : showPassword ? "text" : type}
                  name="password"
                  id="password"
                />
              </div>
              <button className='add-admin-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
