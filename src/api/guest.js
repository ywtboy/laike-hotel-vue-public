import axios from './axiosConfig'

let url = '/api/guest';

export const getGuestOfHotel = query => {
    return axios.get(url, { params: query })
  }