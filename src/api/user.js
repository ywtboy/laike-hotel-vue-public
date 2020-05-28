import axios from "axios"

const url = '/api/user';

export const addUser = user => {
    return axios.post(url, user)
}

export const getUsers = () => {
    return axios.get(url)
}