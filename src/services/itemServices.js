import Axios from './Axios';

let itemServices = {
  addItem: async (obj) => {
    const response = await Axios.post(`addItem`, obj)
    return response
  },

  uploadItemCover: async (id, obj) => {
    const response = await Axios.post(`uploadItemCover/${id}`, obj)
    return response
  },

  getItemById: async (id) => {
    const response = await Axios.get(`getItemById/${id}`)
    return response
  },

  getAllItems: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllItems?page=${page}&size=${size}`)
    return response
  },

  deleteItem: async (id) => {
    const response = await Axios.delete(`deleteItem/${id}`)
    return response
  },
}

export default itemServices;