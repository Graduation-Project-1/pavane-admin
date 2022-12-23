import Axios from './Axios';

let productServices = {
  addProduct: async (obj) => {
    const response = await Axios.post(`addProduct`, obj)
    return response
  },

  uploadProductCover: async (id, obj) => {
    const response = await Axios.post(`uploadProductCover/${id}`, obj)
    return response
  },

  getAllProducts: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllProducts?page=${page}&size=${size}`)
    return response
  },
}

export default productServices;