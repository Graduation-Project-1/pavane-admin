import Axios from './Axios';

let adminServices = {
  addAdmin: async (obj) => {
    const response = await Axios.post(`addAdmin`, obj)
    return response
  },

  getAllAdmins: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllAdmins?page=${page}&size=${size}`)
    return response
  },

  getAdminById: async (id) => {
    const response = await Axios.get(`getAdminById/${id}`)
    return response
  },

  editAdmin: async (id, obj) => {
    const response = await Axios.put(`updateAdmin/${id}`, obj)
    return response
  },

  deleteAdmin: async (id) => {
    const response = await Axios.delete(`deleteAdmin/${id}`)
    return response
  },
}

export default adminServices;