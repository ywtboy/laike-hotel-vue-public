import axios from "axios"


export const getHotel = () => {
  return axios.request({
    url: '/api/hotel',
    method: 'get'
  })
}

export const getRoomType = hotelNo => {
  return axios.get('/api/roomType',{params: hotelNo})
}