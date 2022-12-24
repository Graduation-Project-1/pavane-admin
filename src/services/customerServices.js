import Axios from './Axios';

let customerServices = {
  addUser: async (obj) => {
    const response = await Axios.post(`addUser`, obj)
    return response
  },

  uploadUserImage: async (id, obj) => {
    const response = await Axios.post(`uploadImageUser/${id}`, obj)
    return response
  },

  getUserById: async (id) => {
    const response = await Axios.get(`getUserById/${id}`)
    return response
  },

  deleteUser: async (id) => {
    const response = await Axios.delete(`deleteUser/${id}`)
    return response
  },

  getAllUsers: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllUsers?page=${page}&size=${size}`)
    return response
  },
}

export default customerServices;