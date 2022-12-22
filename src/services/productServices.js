import Axios from './Axios';

let productServices = {
  getAllProducts: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllProducts?page=${page}&size=${size}`)
    return response
  },
}

export default productServices;