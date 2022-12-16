import Axios from './Axios';

let authServices = {
  login: async (obj) => {
    const response = await Axios.post(`loginAdmin`, obj)
    return response
  },
}

export default authServices;