import Joi from 'joi'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import adminServices from '../../../../services/adminServices'
import './EditAdmin.scss'

export default function EditAdmin() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [oldAdmin, setOldAdmin] = useState({
    name: "",
    email: ""
  })

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: ""
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

  async function getAdminByIdHandler() {
    setLoading(true)
    try {
      const { data } = await adminServices.getAdminById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldAdmin({
          name: data?.Data?.name,
          email: data?.Data?.email
        })
        setNewAdmin({
          name: data?.Data?.name,
          email: data?.Data?.email
        })
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewAdminData(e) {
    let newAdminData = { ...newAdmin }
    newAdminData[e.target.name] = e.target.value
    setNewAdmin(newAdminData)
  }

  function editAdminValidation(newAdmin) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^(?![\s.]+$)[a-zA-Z\s.]*$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
    });
    return schema.validate(newAdmin, { abortEarly: false });
  }

  async function editAdminHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editAdminValidation(newAdmin);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newAdmin, oldAdmin)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newAdmin[key]
        }
      })
      try {
        const { data } = await adminServices.editAdmin(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          navigate(`/admins/${params.id}`);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getAdminByIdHandler()
  }, [])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-admin-page">
          <div className="edit-admin-card">
            <h3>Edit Admin</h3>
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
            <form onSubmit={editAdminHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewAdminData}
                className='form-control add-admin-input'
                type="text"
                name="name"
                id="name"
                value={newAdmin.name}
              />
              <label htmlFor="email">Email</label>
              <input
                onChange={getNewAdminData}
                className='form-control add-admin-input'
                type="email"
                name="email"
                id="email"
                value={newAdmin.email}
              />
              <button className='add-admin-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
