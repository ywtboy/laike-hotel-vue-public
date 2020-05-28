import axios from "axios"

const baseUrl = '/api';

export const register = json => {
    return axios.post(baseUrl + '/register', json)
}

export const login = json => {
    return axios.post(baseUrl + '/login', json)
}

export const logout = () => {
    return axios.get(baseUrl + '/logout')
}

export const changePwd = json => {
    return axios.post(baseUrl + '/user/pwd',json)
}

export const getCurrUser = () => {
    return axios.get(baseUrl + '/currUser')
}