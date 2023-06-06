import Axios from './Axios';

let brandServices = {
  addBrand: async (obj) => {
    const response = await Axios.post(`addBrand`, obj)
    return response
  },

  uploadImageBrand: async (id, obj) => {
    const response = await Axios.post(`uploadImageBrand/${id}`, obj)
    return response
  },

  uploadCoverImageBrand: async (id, obj) => {
    const response = await Axios.post(`uploadCoverImageBrand/${id}`, obj)
    return response
  },

  getAllBrands: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllBrands?page=${page}&size=${size}`)
    return response
  },

  getBrandById: async (id) => {
    const response = await Axios.get(`getBrandById/${id}`)
    return response
  },

  brandSearch: async (search, page = 1, size = 10) => {
    const response = await Axios.get(`brandSearch?${search.length > 0 ? `&search=${search}&page=${page}&size=${size}` : ""}`)
    return response
  },

  getMostLikedBrands: async () => {
    const response = await Axios.get(`getMostLikedBrands`)
    return response
  },

  editBrand: async (id, obj) => {
    const response = await Axios.put(`updateBrand/${id}`, obj)
    return response
  },

  deleteBrand: async (id) => {
    const response = await Axios.delete(`deleteBrand/${id}`)
    return response
  },

  addToArchive: async (id) => {
    const response = await Axios.put(`archiveBrand/${id}`)
    return response
  },

  removeFromArchive: async (id) => {
    const response = await Axios.put(`disArchiveBrand/${id}`)
    return response
  },
}

export default brandServices;