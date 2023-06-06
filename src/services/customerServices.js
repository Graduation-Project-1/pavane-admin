import Axios from './Axios';

let customerServices = {
  addCustomer: async (obj) => {
    const response = await Axios.post(`addCustomer`, obj)
    return response
  },

  uploadImageCustomer: async (id, obj) => {
    const response = await Axios.post(`uploadImageCustomer/${id}`, obj)
    return response
  },

  getCustomerById: async (id) => {
    const response = await Axios.get(`getCustomerById/${id}`)
    return response
  },

  editCustomer: async (id, obj) => {
    const response = await Axios.put(`updateCustomer/${id}`, obj)
    return response
  },

  deleteCustomer: async (id) => {
    const response = await Axios.delete(`deleteCustomer/${id}`)
    return response
  },

  getAllCustomers: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllCustomers?page=${page}&size=${size}`)
    return response
  },

  addToArchive: async (id) => {
    const response = await Axios.put(`archiveCustomer/${id}`)
    return response
  },

  removeFromArchive: async (id) => {
    const response = await Axios.put(`disArchiveCustomer/${id}`)
    return response
  },
}

export default customerServices;