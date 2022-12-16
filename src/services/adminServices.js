import Axios from './Axios';

let adminServices = {
  addAdmin: async (obj) => {
    const response = await Axios.post(`addAdmin`, obj)
    return response
  },
}

export default adminServices;