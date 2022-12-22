import Axios from './Axios';

let customerServices = {
  getAllUsers: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllUsers?page=${page}&size=${size}`)
    return response
  },
}

export default customerServices;