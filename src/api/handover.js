import axios from "axios"

const url = '/api/handover';

export const handover = json => {
    return axios.post(url, json)
}

export const getOnDuty = () => {
    return axios.get(url + '/duty')
}