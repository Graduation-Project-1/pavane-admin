import Axios from './Axios';

let advertisementServices = {
  getAllAdvertisement: async () => {
    const response = await Axios.get(`getAllAdvertisement`)
    return response
  },
}

export default advertisementServices;