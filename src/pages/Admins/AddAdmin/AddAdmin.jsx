import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminServices from '../../../services/adminServices';
import './AddAdmin.scss'

export default function AddAdmin() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

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
        .pattern(/^(?![\s.]+$)[a-zA-Z\s.]*$/)
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
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        const { data } = await adminServices.addAdmin(newAdmin)
        if (data.success && data.message === "adminAdded") {
          setLoading(false);
          setIsAdded(true)
          navigate("/admins");
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
        <div className="add-admin-page">
          <div className="add-admin-card">
            <h3>Add Admin</h3>
            {
              isAdded ?
                (<div className="alert alert-success myalert">
                  Added
                </div>) : ""
            }
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
              <label htmlFor="password">Password</label>
              <input
                onChange={getNewAdminData}
                className='form-control add-admin-input'
                type="password"
                name="password"
                id="password"
              />
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
