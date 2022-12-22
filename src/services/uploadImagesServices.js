import Axios from './Axios';

let uploadImagesServices = {
  uploadImages: async (obj) => {
    const response = await Axios.post(`uploadImages`, obj)
    return response
  }
}

export default uploadImagesServices;