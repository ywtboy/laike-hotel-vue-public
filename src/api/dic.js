import axios from './axiosConfig'

export const addDicType = dicType => {
  return axios.post('/api/dicType', dicType)
}

export const updateDicType = dicType => {
  return axios.patch('/api/dicType', dicType)
}

export const addOrUpdateDicType = (dicType, method) => {
  return axios.request({
    url: '/api/dicType',
    data: dicType,
    method: method //post为add patch为更新
  })
}

export const getDicType = dicTypeClass => {
  return axios.get('/api/dicType', { params: { dicTypeClass: dicTypeClass } })
}

export const getDicCommon = query => {
  return axios.get('/api/dicCommon', { params: query })
}

export const addDicCommon = dicCommon => {
  return axios.post('/api/dicCommon', dicCommon)
}

export const addOrUpdateDicCommon = (dicCommon, method) => {
  return axios.request({
    url: '/api/dicCommon',
    data: dicCommon,
    method: method //post为add patch为更新
  })
}

export const getDicByType = dicTypeCode => {
  return axios.get('/api/dicCommon/' + dicTypeCode)
}

// export function getDicByType (dicTypeCode) {
//     return axios.get("/api/dicCommon/" + dicTypeCode)
// }
