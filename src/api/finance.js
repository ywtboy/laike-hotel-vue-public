import axios from "axios"

const url = '/api/finance';

export const collectCash = json => {
    return axios.post(url + '/collect', json)
}

export const addCash = json => {
    return axios.post(url + '/addCash', json)
}

// export const addCash = () => {
//     return axios.get(url + '/duty')
// }