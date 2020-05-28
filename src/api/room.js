import axios from "axios"

const url = '/api/roomType';
const urlRoomState = '/api/roomState/';

export const getRoomType = () => {
  return axios.get(url)
}

export const addOrUpdateRoomType = (roomType, method) => {
    return axios.request({
        url: url,
        data: roomType,
        method: method, //post为add patch为更新
    })
}

export const getRoomState = () => {
    return axios.get(urlRoomState)
}

export const updateRoomState = (roomNo, roomState) => {
  return axios.patch(urlRoomState + roomNo + "?roomState=" + roomState)
}