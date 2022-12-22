import Axios from './Axios';

let brandServices = {
  addVendor: async (obj) => {
    const response = await Axios.post(`addVendor`, obj)
    return response
  },

  uploadBrandImage: async (id, obj) => {
    const response = await Axios.post(`uploadImageVendor/${id}`, obj)
    return response
  },

  getAllVendors: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllVendors?page=${page}&size=${size}`)
    return response
  },

  getVendorById: async (id) => {
    const response = await Axios.get(`getVendorById/${id}`)
    return response
  },

  editVendor: async (id, obj) => {
    const response = await Axios.put(`updateVendor/${id}`, obj)
    return response
  },

  deleteVendor: async (id) => {
    const response = await Axios.delete(`deleteVendor/${id}`)
    return response
  },
}

export default brandServices;