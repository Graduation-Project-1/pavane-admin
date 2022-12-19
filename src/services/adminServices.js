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
}

export default adminServices;