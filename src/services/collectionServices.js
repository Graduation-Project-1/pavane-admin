import Axios from './Axios';

let collectionServices = {
  getAllCollections: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllCollections?page=${page}&size=${size}`)
    return response
  },
}

export default collectionServices;