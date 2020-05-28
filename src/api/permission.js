import axios from "axios"

const url = '/api/permission';


export const getHotelRoles = () => {
    return axios.get(url+"/hotelRole")
  }